# QuestNest - Gamified Chore Tracker

An open-source gamified chore tracking application for families, with features like task management, leveling systems, shops, and pet taming.

## Features

### Core Features
- ✅ **User Authentication** - Secure login/registration with JWT-based authentication
- 👥 **Role-Based Access Control** - Parent (Admin) and Child roles with different permissions
- 📝 **Task Management** - Create one-time or recurring tasks (daily, weekly, monthly)
- ⭐ **Leveling System** - Earn EXP and level up by completing tasks
- 💰 **Points & Rewards** - Collect points to spend in the shop
- 🛒 **Shop System** - Buy items with earned points
- 🐾 **Pet Taming** - Unlock and tame pets as special rewards

### User Roles

**Parent (Admin):**
- Create and assign tasks to children
- Manage shop items
- Create new pets
- View all users and tasks
- Delete tasks

**Child:**
- View assigned tasks
- Complete tasks to earn rewards
- Spend points in the shop
- Tame pets
- Track progress and achievements

## Tech Stack

### Backend
- Node.js with TypeScript
- Express.js for REST API
- JSON file-based database (easily replaceable with PostgreSQL/MongoDB)
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React with TypeScript
- Vite for fast development and building
- React Router for navigation
- Axios for API calls
- Responsive design (works on mobile and desktop)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Holyphoenix/questnest.git
   cd questnest
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and set JWT_SECRET to a secure random string
   npm run build
   ```

3. **Set up the frontend:**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:3000

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. **Access the application:**
   Open your browser and navigate to http://localhost:5173

### First Time Setup

1. Register a parent (admin) account
2. Register one or more child accounts
3. As parent, create some tasks and assign them to children
4. Add items to the shop
5. Create pets that can be tamed
6. Children can now complete tasks to earn rewards!

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login

### Task Endpoints (requires authentication)

- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create task (parent only)
- `PUT /api/tasks/:id` - Update task (parent only)
- `DELETE /api/tasks/:id` - Delete task (parent only)
- `POST /api/tasks/:id/complete` - Complete task

### Shop Endpoints (requires authentication)

- `GET /api/shop/items` - Get all shop items
- `POST /api/shop/items` - Create shop item (parent only)
- `POST /api/shop/purchase` - Purchase an item
- `GET /api/shop/purchases` - Get user's purchases

### Pet Endpoints (requires authentication)

- `GET /api/pets` - Get all available pets
- `POST /api/pets` - Create pet (parent only)
- `POST /api/pets/tame` - Tame a pet
- `GET /api/pets/my-pets` - Get user's tamed pets

### User Endpoints (requires authentication)

- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (parent only)
- `GET /api/users/:id` - Get specific user

## Configuration

### Backend Environment Variables (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EXP_PER_LEVEL=100
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

Built with ❤️ for families who want to make chores fun!

## Security Considerations

### For Production Deployments

This application is designed for private, family use. Before deploying to a public-facing server, consider adding:

1. **Rate Limiting** - Add rate limiting middleware to prevent abuse:
   ```bash
   npm install express-rate-limit
   ```
   Apply to authentication and API routes.

2. **HTTPS** - Always use HTTPS in production. Use a reverse proxy like nginx or a service like Cloudflare.

3. **Environment Variables** - Never commit `.env` files. Always use strong, random JWT secrets in production.

4. **Input Validation** - The app uses basic validation. Consider adding more comprehensive validation with libraries like Joi or Zod for production.

5. **Database** - Consider migrating from JSON file storage to a proper database (PostgreSQL, MongoDB) for better performance and reliability.

6. **CORS Configuration** - Update CORS settings in `backend/src/server.ts` to only allow your frontend domain.

### Current Security Features

✅ Password hashing with bcrypt  
✅ JWT-based authentication  
✅ Role-based access control  
✅ Protected API endpoints  
✅ Basic input validation
