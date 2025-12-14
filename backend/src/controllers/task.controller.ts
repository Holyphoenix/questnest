import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/database';
import { config } from '../config';
import { Task, TaskStatus, TaskFrequency } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      assignedTo,
      frequency,
      expReward,
      pointsReward,
      dueDate,
      scheduledDays,
      scheduledDate
    } = req.body;

    if (!title || !assignedTo || !frequency) {
      res.status(400).json({ error: 'Title, assignedTo, and frequency are required' });
      return;
    }

    if (!Object.values(TaskFrequency).includes(frequency)) {
      res.status(400).json({ error: 'Invalid frequency' });
      return;
    }

    // Verify assigned user exists
    const assignedUser = db.getUserById(assignedTo);
    if (!assignedUser) {
      res.status(404).json({ error: 'Assigned user not found' });
      return;
    }

    const task: Task = {
      id: uuidv4(),
      title,
      description: description || '',
      assignedTo,
      createdBy: req.user!.id,
      frequency,
      status: TaskStatus.PENDING,
      expReward: expReward || 10,
      pointsReward: pointsReward || 5,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      scheduledDays,
      scheduledDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.createTask(task);
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    let tasks: Task[];

    if (req.user!.role === 'parent') {
      // Parents can see all tasks
      tasks = db.getTasks();
    } else {
      // Children can only see their assigned tasks
      tasks = db.getTasksByUserId(req.user!.id);
    }

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = db.getTaskById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Check permissions
    if (req.user!.role !== 'parent' && task.assignedTo !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const completeTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = db.getTaskById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Only assigned user can complete
    if (task.assignedTo !== req.user!.id) {
      res.status(403).json({ error: 'You can only complete your own tasks' });
      return;
    }

    if (task.status === TaskStatus.COMPLETED) {
      res.status(400).json({ error: 'Task already completed' });
      return;
    }

    // Update task status
    const updatedTask = db.updateTask(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date()
    });

    // Award rewards to user
    const user = db.getUserById(req.user!.id);
    if (user) {
      const newExp = user.exp + task.expReward;
      const newLevel = Math.floor(newExp / config.expPerLevel) + 1;
      const newPoints = user.points + task.pointsReward;

      db.updateUser(user.id, {
        exp: newExp,
        level: newLevel,
        points: newPoints
      });

      res.json({
        message: 'Task completed successfully',
        task: updatedTask,
        rewards: {
          exp: task.expReward,
          points: task.pointsReward,
          levelUp: newLevel > user.level
        },
        user: {
          level: newLevel,
          exp: newExp,
          points: newPoints
        }
      });
    }
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = db.getTaskById(id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Only creator (parent) can update
    if (task.createdBy !== req.user!.id) {
      res.status(403).json({ error: 'Only task creator can update' });
      return;
    }

    const updatedTask = db.updateTask(id, updates);
    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = db.getTaskById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Only creator (parent) can delete
    if (task.createdBy !== req.user!.id) {
      res.status(403).json({ error: 'Only task creator can delete' });
      return;
    }

    db.deleteTask(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
