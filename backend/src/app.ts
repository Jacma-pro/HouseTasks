import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth';
import familiesRoutes from './routes/families';
import tasksRoutes from './routes/tasks';
import availabilityRoutes from './routes/availability';
import usersRoutes from './routes/users';
import dashboardRoutes from './routes/dashboard';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map(s => s.trim())
    : 'http://localhost:5173',
}));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/families', familiesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
