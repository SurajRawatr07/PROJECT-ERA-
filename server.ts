import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db';
import { apiRouter } from './server/routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Parse JSON, urlencoded, and cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================================================
// API ROUTES (Must precede Vite middleware)
// ============================================================================
app.use('/api', apiRouter);

// ============================================================================
// VITE MIDDLEWARE & STATIC SERVING (Express + Vite setup)
// ============================================================================
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[ProjectVerse 2.0] Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err: any) {
    console.error('[ProjectVerse 2.0] Fatal startup error:', err);
    process.exit(1);
  }
}

startServer();
