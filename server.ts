import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const BACKEND_URL =
  process.env.BACKEND_URL || 'http://localhost:8090';

// Spring Boot API Proxy
// Forward /api requests to Java Spring Boot backend.
const apiProxy = createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathFilter: (pathname) =>
    pathname === '/api' || pathname.startsWith('/api/'),
  on: {
    error: (err, req, res) => {
      console.error('Spring Boot proxy error:', err.message);

      if ('writeHead' in res && !res.headersSent) {
        res.writeHead(502, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          success: false,
          message: 'Spring Boot backend is not available.'
        }));
      }
    }
  }
});

// IMPORTANT: API proxy must come before Vite middleware.
app.use(apiProxy);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');

    const vite = await createServer({
      configFile: path.join(__dirname, 'vite.config.ts'),
      server: {
        middlewareMode: true
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('====================================');
    console.log('PeerLearn Frontend Server Started');
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`Spring Boot: ${BACKEND_URL}`);
    console.log('API Proxy: ENABLED');
    console.log('====================================');
  });
}

startServer().catch((error) => {
  console.error('Failed to start PeerLearn:', error);
  process.exit(1);
});