import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../src/types';
import { getSession, getUserById, ServerUser } from './db';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: ServerUser;
      sessionToken?: string;
    }
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
 * Authentication Middleware: Extracts token and attaches authenticated user
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : (req.headers['x-access-token'] as string);

  if (!token) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication token required. Please sign in.'
    });
    return;
  }

  const session = getSession(token);
  if (!session) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired session token. Please sign in again.'
    });
    return;
  }

  const user = getUserById(session.userId);
  if (!user) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authenticated user account was not found.'
    });
    return;
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

/**
 * Optional Authentication: Populates req.user if a valid token exists
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : (req.headers['x-access-token'] as string);

  if (token) {
    const session = getSession(token);
    if (session) {
      const user = getUserById(session.userId);
      if (user) {
        req.user = user;
        req.sessionToken = token;
      }
    }
  }
  next();
}

/**
 * RBAC Role Check Middleware: Enforces that req.user has one of the required roles
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
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
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      });
      return;
    }

    // Privileged verification review & queue view requires authorized reviewer status
    if (permission === 'VERIFICATION_REVIEW' || permission === 'VERIFICATION_QUEUE_VIEW') {
      if (req.user.role === 'ADMIN' || req.user.isAuthorizedReviewer) {
        return next();
      }
      res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Forbidden: Privileged review and verification queue access requires formal reviewer authorization.'
      });
      return;
    }

    const userPerms = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPerms.includes(permission)) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: `Forbidden: You do not possess the required permission [${permission}].`
      });
      return;
    }

    next();
  };
}
