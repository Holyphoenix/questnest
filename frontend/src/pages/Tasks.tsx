import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task, TaskFrequency, TaskStatus, UserRole, User } from '../types';
import * as api from '../services/api';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [frequency, setFrequency] = useState<TaskFrequency>(TaskFrequency.ONCE);
  const [expReward, setExpReward] = useState(10);
  const [pointsReward, setPointsReward] = useState(5);

  useEffect(() => {
    loadTasks();
    if (user?.role === UserRole.PARENT) {
      loadUsers();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const { tasks: fetchedTasks } = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { users: fetchedUsers } = await api.getUsers();
      setUsers(fetchedUsers.filter(u => u.role === UserRole.CHILD));
    } catch (err: any) {
      console.error('Failed to load users:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await api.createTask({
        title,
        description,
        assignedTo,
        frequency,
        expReward,
        pointsReward
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setFrequency(TaskFrequency.ONCE);
      setExpReward(10);
      setPointsReward(5);
      setShowCreateForm(false);
      
      // Reload tasks
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await api.completeTask(taskId);
      loadTasks();
      // Reload user data to update stats
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.deleteTask(taskId);
      loadTasks();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading tasks...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📝 Tasks</h1>
        {user?.role === UserRole.PARENT && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showCreateForm ? 'Cancel' : '+ New Task'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Create Task Form */}
      {showCreateForm && user?.role === UserRole.PARENT && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Assign to:</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Select a child...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Frequency:</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value={TaskFrequency.ONCE}>One Time</option>
                <option value={TaskFrequency.DAILY}>Daily</option>
                <option value={TaskFrequency.WEEKLY}>Weekly</option>
                <option value={TaskFrequency.MONTHLY}>Monthly</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>EXP Reward:</label>
                <input
                  type="number"
                  value={expReward}
                  onChange={(e) => setExpReward(parseInt(e.target.value))}
                  min="1"
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Points Reward:</label>
                <input
                  type="number"
                  value={pointsReward}
                  onChange={(e) => setPointsReward(parseInt(e.target.value))}
                  min="1"
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            </div>
            
            <button
              type="submit"
              style={{
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {tasks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            No tasks yet. {user?.role === UserRole.PARENT ? 'Create one to get started!' : 'Check back later!'}
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              style={{
                padding: '20px',
                backgroundColor: task.status === TaskStatus.COMPLETED ? '#e8f5e9' : '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: task.status === TaskStatus.COMPLETED ? '4px solid #4CAF50' : '4px solid #2196F3'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0 }}>{task.title}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>{task.description}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '14px' }}>
                    <span style={{ padding: '4px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                      {task.frequency}
                    </span>
                    <span>⭐ +{task.expReward} EXP</span>
                    <span>💰 +{task.pointsReward} points</span>
                    {task.status === TaskStatus.COMPLETED && (
                      <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Completed</span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  {task.status === TaskStatus.PENDING && task.assignedTo === user?.id && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Complete
                    </button>
                  )}
                  
                  {user?.role === UserRole.PARENT && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
