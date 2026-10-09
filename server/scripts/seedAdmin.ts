import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB, UserModel } from '../db';

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  if (!adminEmail || !adminPassword) {
    console.error(
      'ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to run seed:admin.'
    );
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await UserModel.findOne({ email: adminEmail }).exec();
    if (existing) {
      console.log(`[SeedAdmin] Admin account already exists for ${adminEmail}. No changes made.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const adminUser = await UserModel.create({
      fullName: adminName,
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      accountType: 'ADMIN',
      institution: 'ProjectVerse Central Registry',
      department: 'Platform Governance',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      verification: {
        email: 'VERIFIED',
        phone: 'VERIFIED',
        github: 'VERIFIED',
        academic: 'VERIFIED',
        document: 'VERIFIED',
        institution: 'VERIFIED',
        emailVerified: true,
        phoneVerified: true,
        githubVerified: true,
        academicVerified: true,
        documentVerified: true,
        institutionVerified: true,
        facultyReviewed: true
      }
    });

    console.log(`[SeedAdmin] Created ADMIN user successfully: ${adminUser.email} (ID: ${adminUser.id})`);
    process.exit(0);
  } catch (error: any) {
    console.error('[SeedAdmin] Failed to seed admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();
