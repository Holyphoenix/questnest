import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import shopRoutes from './routes/shop.routes';
import petRoutes from './routes/pet.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuestNest API is running' });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 QuestNest backend running on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
});

export default app;
