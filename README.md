# ProjectVerse 2.0 — Academic & Open-Source Project Continuity Platform

ProjectVerse 2.0 is a full-stack web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB Atlas (Mongoose)**.

---

## Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: MongoDB Atlas cluster (or local MongoDB instance)

---

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

---

## Environment (`.env`)

Configure the following variables inside your `.env` file:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/projectverse?retryWrites=true&w=majority
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
PORT=3000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Optional variables for seeding an initial administrator account via `npm run seed:admin`:
```env
ADMIN_EMAIL=admin@projectverse.edu
ADMIN_PASSWORD=YourStrongAdminPassword
```

---

## MongoDB Atlas Setup

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/) and create a cluster (free **M0 Sandbox** works).
2. Under **Security → Database Access**, create a database user with **Read and write to any database** permissions.
3. Under **Security → Network Access**, add your IP address (or `0.0.0.0/0` for development).
4. Click **Connect → Drivers** on your cluster and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/projectverse?retryWrites=true&w=majority
   ```
5. Paste the connection string as `MONGODB_URI` in `.env`. MongoDB automatically creates the `projectverse` database and all collections (`users`, `projects`, `projectMembers`, `projectLineages`, `projectReviews`, `verifications`, `institutions`, `collaborationRequests`, `notifications`) on first write.

---

## Run, Build & Production Commands

### Development
Starts the Express backend and Vite frontend middleware on `http://localhost:3000`:
```bash
npm run dev
```

### Seed Administrator Account
Seeds an `ADMIN` user using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`:
```bash
npm run seed:admin
```

### Build
Compiles the frontend and bundles the Node/Express server into `dist/`:
```bash
npm run build
```

### Production
Starts the compiled production server:
```bash
npm start
```

---

## API Reference

See [API.md](./API.md) for full documentation of all REST API endpoints.
