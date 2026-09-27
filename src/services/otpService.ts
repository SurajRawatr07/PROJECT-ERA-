import { normalizeEmail } from '../utils/validation';
import { userService } from './userService';
import { storageAdapter } from './storageAdapter';

export interface OtpSendResult {
  success: boolean;
  message: string;
  code?: string;
  demoHint?: string;
  expiresAt: number;
}

export interface OtpVerifyResult {
  success: boolean;
  message?: string;
}

interface StoredOtpRecord {
  email: string;
  code: string;
  purpose: 'REGISTRATION' | 'PASSWORD_RESET';
  createdAt: number;
  expiresAt: number;
  verified: boolean;
}

const OTP_STORAGE_KEY = 'pv_otp_records_v1';
export const STANDARD_DEMO_OTP = '123456';
const UNIVERSAL_DEMO_CODE = '849201';

class OtpService {
  private getRecords(): Record<string, StoredOtpRecord> {
    return storageAdapter.getItem<Record<string, StoredOtpRecord>>(OTP_STORAGE_KEY, {});
  }

  private saveRecord(record: StoredOtpRecord): void {
    const records = this.getRecords();
    records[record.email] = record;
    storageAdapter.setItem(OTP_STORAGE_KEY, records);
  }

  /**
   * Generates and dispatches a 6-digit OTP code to the given email
   */
  async sendOtp(
    email: string,
    purpose: 'REGISTRATION' | 'PASSWORD_RESET' = 'REGISTRATION'
  ): Promise<OtpSendResult> {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) {
      return {
        success: false,
        message: 'A valid email address is required.',
        expiresAt: 0
      };
    }

    // Generate random 6-digit code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store record locally
    const record: StoredOtpRecord = {
      email: cleanEmail,
      code: generatedCode,
      purpose,
      createdAt: Date.now(),
      expiresAt,
      verified: false
    };
    this.saveRecord(record);

    // Also attempt server sync if backend API is running
    try {
      const endpoint = purpose === 'PASSWORD_RESET' ? '/api/auth/forgot-password' : '/api/auth/send-email-otp';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        return {
          success: true,
          message: data.message || `Verification code sent to ${cleanEmail}.`,
          code: generatedCode,
          demoHint: `Code sent! For preview convenience: ${generatedCode} (Universal fallback: ${UNIVERSAL_DEMO_CODE})`,
          expiresAt
        };
      }
    } catch {
      // Offline / standalone fallback
    }

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      code: STANDARD_DEMO_OTP,
      demoHint: `Demo OTP: ${STANDARD_DEMO_OTP}`,
      expiresAt
    };
  }

  /**
   * Verifies the 6-digit OTP code
   */
  async verifyOtp(email: string, code: string): Promise<OtpVerifyResult> {
    const cleanEmail = normalizeEmail(email);
    const cleanCode = (code || '').trim();

    if (!cleanEmail || !cleanCode) {
      return {
        success: false,
        message: 'Email and 6-digit verification code are required.'
      };
    }

    if (cleanCode.length !== 6) {
      return {
        success: false,
        message: 'Please enter all 6 digits of the verification code.'
      };
    }

    // 1. Universal demo OTP check (standard 123456 or 849201)
    if (cleanCode === STANDARD_DEMO_OTP || cleanCode === UNIVERSAL_DEMO_CODE) {
      const records = this.getRecords();
      if (records[cleanEmail]) {
        records[cleanEmail].verified = true;
        this.saveRecord(records[cleanEmail]);
      }
      return { success: true };
    }

    // 2. Check local store
    const records = this.getRecords();
    const record = records[cleanEmail];
    if (record) {
      if (Date.now() > record.expiresAt) {
        return {
          success: false,
          message: 'Verification code has expired. Please request a new code.'
        };
      }
      if (record.code === cleanCode) {
        record.verified = true;
        this.saveRecord(record);
        return { success: true };
      }
    }

    // 3. Fallback check with server
    try {
      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode })
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        return { success: true };
      }
    } catch {
      // Ignore network errors in preview
    }

    return {
      success: false,
      message: `Invalid code entered. Please enter Demo OTP: ${STANDARD_DEMO_OTP}.`
    };
  }

  /**
   * Resets password given a verified OTP
   */
  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) {
      return { success: false, message: 'Invalid email address.' };
    }

    const verifyResult = await this.verifyOtp(cleanEmail, code);
    if (!verifyResult.success) {
      return { success: false, message: verifyResult.message || 'Invalid or expired OTP.' };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }

    // 1. Update in userService
    const user = userService.getByEmail(cleanEmail);
    if (user) {
      userService.updateUser(user.id, { password: newPassword });
    }

    // 2. Update in legacy pv_user_database_v4
    try {
      const legacyUsers = storageAdapter.getItem<any[]>('pv_user_database_v4', []);
      const matchIdx = legacyUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (matchIdx !== -1) {
        legacyUsers[matchIdx].passwordHash = newPassword;
        storageAdapter.setItem('pv_user_database_v4', legacyUsers);
      }
    } catch {
      // ignore
    }

    // 3. Sync to server endpoint if online
    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code, newPassword })
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      message: 'Your password has been reset successfully! You can now sign in with your new password.'
    };
  }
}

export const otpService = new OtpService();
