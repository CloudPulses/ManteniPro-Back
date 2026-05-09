import express from 'express';
import cors from 'cors';
import { swaggerDocument } from './docs/swagger';

const app = express();

app.use(cors());
app.use(express.json());

import apiRoutes from './routes';
app.use('/api', apiRoutes);

// Swagger UI - Solo disponible en desarrollo
if (process.env.NODE_ENV !== 'production') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require('swagger-ui-express');
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      customSiteTitle: 'ManteniPro API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
    }));
    console.log('Swagger UI disponible en /api/docs');
  } catch {
    console.warn('swagger-ui-express no instalado. Ejecuta: npm install -D swagger-ui-express @types/swagger-ui-express');
  }
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
