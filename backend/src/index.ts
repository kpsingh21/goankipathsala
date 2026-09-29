import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { tenantMiddleware } from './middleware/tenant.middleware.js';
import apiRoutes from './routes.js';

import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded media files from desktop
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use(tenantMiddleware);

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Goan Ki Pathshala API',
    tenant: {
      id: req.tenantId || null,
      slug: req.tenantSlug || null,
    },
  });
});


import { docsHandler } from './controllers/docs.controller.js';

// Interactive API Documentation
app.get('/docs', docsHandler);

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Goan Ki Pathshala (गाँव की पाठशाला) API',
    version: '0.1.0',
    documentation: '/docs',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Goan Ki Pathshala backend running on http://localhost:${PORT}`);
});
