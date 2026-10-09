# ProjectVerse 2.0 REST API Documentation

All API responses return JSON with a `success` boolean flag and appropriate HTTP status codes.
Protected routes accept either an `Authorization: Bearer <token>` header or an `httpOnly` `pv_token` cookie.

---

## Authentication

### `POST /api/auth/register`
Registers a new user account (`STUDENT`, `FACULTY`, or `HOD`). `ADMIN` registration via public signup is blocked (`403`).
- **Body**: `{ fullName, email, password, role, accountType, institution, department, course, rollNumber, batch, graduationYear, skills }`
- **Response (`201`)**: `{ success: true, token, user }` (never includes `passwordHash`).

### `POST /api/auth/login`
Authenticates a user with email and password using `bcrypt` comparison.
- **Body**: `{ email, password }`
- **Response (`200`)**: `{ success: true, token, user }`
- **Error (`401`)**: `{ success: false, message: "Invalid email or password" }`

### `POST /api/auth/logout`
Clears the HTTP-only authentication cookie and ends the user session.
- **Response (`200`)**: `{ success: true, message: "Logged out successfully." }`

### `GET /api/auth/me`
Returns the currently authenticated user profile from MongoDB.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, user }`

---

## Users & Profiles

### `GET /api/users/me`
Returns the authenticated user's full MongoDB profile.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, user, profile }`

### `PATCH /api/users/me`
Updates the authenticated user's profile fields (`fullName`, `bio`, `skills`, `githubUrl`, `linkedinUrl`, `portfolioUrl`, `phone`, `department`, `course`, `batch`). Does not permit modifying `role`, `verificationStatus`, or admin privileges.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, profile }`

### `GET /api/users/:id`
Fetches a public user profile by MongoDB ObjectId.
- **Response (`200`)**: `{ success: true, profile }`

---

## Projects & Discovery

### `POST /api/projects`
Creates a new project in MongoDB and automatically generates its **Project Passport** (`passportId`, QR verification hash, lineage batch `v1.0`, and owner membership).
- **Auth**: Required
- **Body**: `{ title, tagline, description, problem, solution, domain, techStack, skillsRequired, difficulty, projectType, visibility, repositoryUrl, demoUrl, documentationUrl, institution, department, academicYear }`
- **Response (`201`)**: `{ success: true, project }`

### `GET /api/projects`
Lists projects with support for filtering and search.
- **Query Params**: `search`, `domain`, `tech` / `technology`, `difficulty`, `type`, `institution`, `status`
- **Response (`200`)**: `{ success: true, count, projects }`

### `GET /api/projects/:id`
Returns complete project details by MongoDB `_id` or `passportId`, including creator, contributors, Project Passport, lineage records, and faculty reviews.
- **Response (`200`)**: `{ success: true, project }`

### `PATCH /api/projects/:id`
Updates an existing project (restricted to project owner or `ADMIN`).
- **Auth**: Required
- **Response (`200`)**: `{ success: true, project }`

### `DELETE /api/projects/:id`
Deletes a project and its associated memberships and lineage (restricted to project owner or `ADMIN`).
- **Auth**: Required
- **Response (`200`)**: `{ success: true, message }`

---

## Project Lineage & Continuity

### `POST /api/projects/:id/continue`
Creates a new generational continuation milestone (`ProjectLineage`) linked to the project, preserving historical contributors and advancing the active batch version.
- **Auth**: Required
- **Body**: `{ year, batchName, version, summary, handoverNotes, keyMilestones, majorChanges }`
- **Response (`201`)**: `{ success: true, project, lineage }`

### `GET /api/projects/:id/lineage`
Retrieves the complete chronological lineage tree for a project.
- **Response (`200`)**: `{ success: true, count, lineage }`

---

## Collaboration Requests

### `POST /api/collaboration/request`
Submits a request to join a project as a contributor.
- **Auth**: Required
- **Body**: `{ projectId, roleInterest, message }`
- **Response (`201`)**: `{ success: true, request }`

### `GET /api/collaboration/received`
Lists collaboration requests received by the authenticated project owner.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, count, requests }`

### `GET /api/collaboration/sent`
Lists collaboration requests sent by the authenticated user.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, count, requests }`

### `PATCH /api/collaboration/:id/accept`
Accepts a collaboration request, creates a `ProjectMember` record in MongoDB, adds the contributor to the project, and dispatches a notification.
- **Auth**: Required (Project Owner or `ADMIN`)
- **Response (`200`)**: `{ success: true, request }`

### `PATCH /api/collaboration/:id/reject`
Rejects a collaboration request.
- **Auth**: Required (Project Owner or `ADMIN`)
- **Response (`200`)**: `{ success: true, request }`

---

## Faculty & Peer Reviews

### `POST /api/projects/:id/reviews`
Submits a structured review for a project. Self-reviews by the project owner are prohibited (`403`).
- **Auth**: Required (`FACULTY`, `HOD`, `ADMIN`)
- **Body**: `{ score, comments, status, rubricScores }`
- **Response (`201`)**: `{ success: true, review, project }`

### `GET /api/projects/:id/reviews`
Lists all reviews for a project.
- **Response (`200`)**: `{ success: true, count, reviews }`

---

## Verification & Document Uploads

### `POST /api/verifications`
Submits an institutional/academic verification request.
- **Auth**: Required
- **Body**: `{ documentType, documentFileName, documentFileSize, documentPath, documentMimeType }`
- **Response (`201`)**: `{ success: true, request }`

### `GET /api/verifications`
Lists verification requests (returns all requests for `FACULTY`/`HOD`/`ADMIN`, or own requests for `STUDENT`).
- **Auth**: Required
- **Response (`200`)**: `{ success: true, count, verifications }`

### `PATCH /api/verifications/:id`
Approves (`VERIFIED`) or rejects (`REJECTED`) a verification request and updates the target user's verification status.
- **Auth**: Required (`FACULTY`, `HOD`, `ADMIN`)
- **Body**: `{ status: 'VERIFIED' | 'REJECTED', rejectionReason }`
- **Response (`200`)**: `{ success: true, verification }`

---

## Notifications

### `GET /api/notifications`
Returns the authenticated user's notifications sorted newest first.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, count, notifications }`

### `PATCH /api/notifications/:id/read`
Marks a specific notification as read.
- **Auth**: Required
- **Response (`200`)**: `{ success: true, notification }`
