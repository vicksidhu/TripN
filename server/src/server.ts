import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import placeRoutes from './routes/placeRoutes.js';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  'http://localhost:8081',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips', activityRoutes);
app.use('/api/trips', expenseRoutes);
app.use('/api/places', placeRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'TripN API is running',
  });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TripN API running on http://localhost:${PORT}`);
  });
}

startServer();