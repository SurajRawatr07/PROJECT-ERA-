import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { UserRole } from '../src/types';
import UserModel, { IUser } from './models/User';
import ProjectModel from './models/Project';
import ProjectMemberModel from './models/ProjectMember';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      sessionToken?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'projectverse_jwt_secure_key_2026_dev';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export type Permission =
  | 'PROJECT_CREATE'
  | 'PROJECT_EDIT'
  | 'PROJECT_DELETE'
  | 'VERIFICATION_SUBMIT'
  | 'VERIFICATION_QUEUE_VIEW'
  | 'VERIFICATION_REVIEW'
  | 'ADMIN_USERS_MANAGE'
  | 'INSTITUTION_MANAGE'
  | 'ACCREDITATION_VIEW'
  | 'MENTORSHIP_OFFER'
  | 'COLLABORATION_REQUEST';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  STUDENT: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'VERIFICATION_SUBMIT',
    'COLLABORATION_REQUEST'
  ],
  ALUMNI: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'VERIFICATION_SUBMIT',
    'MENTORSHIP_OFFER',
    'COLLABORATION_REQUEST'
  ],
  DEVELOPER: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'COLLABORATION_REQUEST',
    'MENTORSHIP_OFFER'
  ],
  RESEARCHER: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'COLLABORATION_REQUEST',
    'MENTORSHIP_OFFER'
  ],
  INDUSTRY_PROFESSIONAL: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'COLLABORATION_REQUEST',
    'MENTORSHIP_OFFER'
  ],
  FACULTY: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'VERIFICATION_QUEUE_VIEW',
    'VERIFICATION_REVIEW',
    'MENTORSHIP_OFFER',
    'COLLABORATION_REQUEST'
  ],
  HOD: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'VERIFICATION_QUEUE_VIEW',
    'VERIFICATION_REVIEW',
    'INSTITUTION_MANAGE',
    'ACCREDITATION_VIEW',
    'MENTORSHIP_OFFER'
  ],
  INSTITUTION: [
    'PROJECT_CREATE',
    'INSTITUTION_MANAGE',
    'ACCREDITATION_VIEW',
    'VERIFICATION_QUEUE_VIEW'
  ],
  ADMIN: [
    'PROJECT_CREATE',
    'PROJECT_EDIT',
    'PROJECT_DELETE',
    'VERIFICATION_QUEUE_VIEW',
    'VERIFICATION_REVIEW',
    'ADMIN_USERS_MANAGE',
    'INSTITUTION_MANAGE',
    'ACCREDITATION_VIEW',
    'MENTORSHIP_OFFER',
    'COLLABORATION_REQUEST'
  ]
};

/**
 * Extracts authentication token from Header, Query, or Cookies
 */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.headers['x-access-token']) {
    return String(req.headers['x-access-token']).trim();
  }
  if (req.cookies && req.cookies.pv_token) {
    return req.cookies.pv_token;
  }
  return null;
}

/**
 * RequireAuth / AuthenticateToken Middleware:
 * Validates JWT, verifies user in MongoDB, and attaches authenticated user to req.user.
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication token required. Please sign in.'
    });
    return;
  }

  const payload = verifyJwtToken(token);
  if (!payload || !payload.userId) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired session token. Please sign in again.'
    });
    return;
  }

  try {
    const user = await UserModel.findById(payload.userId).exec();
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authenticated user account was not found.'
      });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        error: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended. Please contact the administrator.'
      });
      return;
    }

    req.user = user;
    req.sessionToken = token;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to verify user credentials.'
    });
  }
}

export const requireAuth = authenticateToken;

/**
 * Optional Authentication: Populates req.user if a valid token exists
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractToken(req);
  if (token) {
    const payload = verifyJwtToken(token);
    if (payload && payload.userId) {
      try {
        const user = await UserModel.findById(payload.userId).exec();
        if (user && user.status !== 'SUSPENDED') {
          req.user = user;
          req.sessionToken = token;
        }
      } catch {
        // ignore
      }
    }
  }
  next();
}

/**
 * RBAC Role Check Middleware: Enforces that req.user has one of the allowed roles
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Forbidden: Identity/Role '${req.user.role}' is not authorized to access this resource. Required role(s): ${allowedRoles.join(', ')}.`
      });
      return;
    }

    next();
  };
}

/**
 * RBAC Permission Check Middleware: Enforces that req.user has the given permission
 */
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      });
      return;
    }

    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (permission === 'VERIFICATION_REVIEW' || permission === 'VERIFICATION_QUEUE_VIEW') {
      if (req.user.isAuthorizedReviewer || req.user.role === 'FACULTY' || req.user.role === 'HOD') {
        return next();
      }
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Forbidden: Privileged review and verification queue access requires formal reviewer authorization.'
      });
      return;
    }

    const userPerms = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPerms.includes(permission)) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Forbidden: You do not possess the required permission [${permission}].`
      });
      return;
    }

    next();
  };
}

/**
 * Project Ownership Authorization Middleware:
 * Verifies that the authenticated user is the owner of the project (or is an ADMIN).
 */
export async function requireProjectOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }

  const projectId = req.params.id || req.params.projectId;
  if (!projectId) {
    res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Project ID is required.' });
    return;
  }

  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(projectId);
    const filter: any = isObjectId ? { $or: [{ _id: projectId }, { passportId: projectId }] } : { passportId: projectId };
    const project = await ProjectModel.findOne(filter).exec();

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    if (project.owner && project.owner.toString() === req.user.id) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Unauthorized: Only the project creator or an administrator can modify this project.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
}

/**
 * Project Member or Contributor Check Middleware:
 * Verifies that the user is a contributor, member, owner, or admin.
 */
export async function requireProjectMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }

  const projectId = req.params.id || req.params.projectId;
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(projectId);
    const filter: any = isObjectId ? { $or: [{ _id: projectId }, { passportId: projectId }] } : { passportId: projectId };
    const project = await ProjectModel.findOne(filter).exec();

    if (!project) {
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Project not found.' });
      return;
    }

    if (project.owner && project.owner.toString() === req.user.id) {
      return next();
    }

    const isContributor = project.contributors.some(
      (c) => c.user && c.user.toString() === req.user!.id
    );
    if (isContributor) {
      return next();
    }

    const memberRecord = await ProjectMemberModel.findOne({
      projectId: project._id,
      userId: req.user.id
    }).exec();
    if (memberRecord) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Unauthorized: You are not a member or contributor on this project.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
}
