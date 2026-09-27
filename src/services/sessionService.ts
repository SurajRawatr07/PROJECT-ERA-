import { SessionData, UserRole } from '../types/auth';
import { storageAdapter } from './storageAdapter';

const SESSION_KEY = 'pv_auth_session_v4';

class SessionService {
  getSession(): SessionData | null {
    let session = storageAdapter.getItem<SessionData | null>(SESSION_KEY, null);
    if (!session) {
      session = storageAdapter.getItem<SessionData | null>('pv_auth_session', null);
    }
    if (!session) return null;

    // Check expiration
    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.clearSession();
      return null;
    }

    return session;
  }

  setSession(userId: string, role: UserRole, token?: string, userProfile?: any): SessionData {
    const sessionToken = token || `pv_sec_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sessionData: any = {
      userId,
      role,
      token: sessionToken,
      user: userProfile || { id: userId, role },
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
    };

    storageAdapter.setItem(SESSION_KEY, sessionData);
    storageAdapter.setItem('pv_auth_session', sessionData);
    return sessionData;
  }

  clearSession(): void {
    storageAdapter.removeItem(SESSION_KEY);
    storageAdapter.removeItem('pv_auth_session');
  }

  hasSession(): boolean {
    return this.getSession() !== null;
  }
}

export const sessionService = new SessionService();

