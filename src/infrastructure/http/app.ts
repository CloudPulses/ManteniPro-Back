import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

import apiRoutes from './routes';
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
