# Todo Application Setup Guide

This guide provides detailed setup instructions for the Full-Stack Todo Application.

## Quick Start (Docker)

1. **Clone and start the application:**
   ```bash
   git clone <repository-url>
   cd fastApi-ToDo
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Manual Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ENVIRONMENT=development
   ```

5. **Start PostgreSQL:**
   ```bash
   docker run --name postgres -e POSTGRES_DB=todoapp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   ```

6. **Run the application:**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/todoapp` |
| `SECRET_KEY` | JWT secret key (change in production) | `your-super-secret-key-change-this-in-production` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `ENVIRONMENT` | Application environment | `development` |

### Frontend Environment

The frontend automatically connects to the backend at `http://localhost:8000`.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/token` - Login and get access token
- `GET /auth/me` - Get current user profile

### Todos
- `GET /todos/` - Get all todos for authenticated user
- `POST /todos/` - Create a new todo
- `GET /todos/{id}` - Get a specific todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `hashed_password` - Hashed password
- `is_active` - User status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Todos Table
- `id` - Primary key
- `title` - Todo title
- `description` - Optional description
- `completed` - Completion status
- `user_id` - Foreign key to users table
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Features

- 🔐 JWT-based authentication
- ✅ Full CRUD operations for todos
- 📱 Responsive design
- 🔄 Real-time updates
- 🎨 Modern UI with Tailwind CSS
- 📊 Form validation
- 🚀 Fast development with Vite
- 🐳 Docker support

## Technology Stack

### Backend
- FastAPI - Modern Python web framework
- SQLAlchemy - SQL toolkit and ORM
- PostgreSQL - Relational database
- JWT - Authentication
- Alembic - Database migrations

### Frontend
- React - Frontend library
- TypeScript - Type safety
- Vite - Build tool
- Tailwind CSS - Styling
- React Query - Server state management
- React Hook Form - Form handling
- Zustand - Client state management

## Troubleshooting

### Common Issues

1. **Port 5432 already in use:**
   - Change PostgreSQL port in docker-compose.yml
   - Or stop local PostgreSQL service

2. **White screen on frontend:**
   - Check browser console for JavaScript errors
   - Ensure backend is running
   - Verify CORS settings

3. **Database connection errors:**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Check database credentials

4. **JWT token errors:**
   - Verify SECRET_KEY in .env
   - Check token expiration time
   - Clear browser localStorage

### Development Tips

- Use `docker-compose logs [service]` to check logs
- Use `docker-compose restart [service]` to restart services
- Backend auto-reloads on code changes
- Frontend auto-reloads on code changes

## Production Deployment

1. **Update environment variables:**
   - Use strong SECRET_KEY
   - Set proper DATABASE_URL
   - Configure CORS origins

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Use production database:**
   - Set up PostgreSQL instance
   - Update DATABASE_URL

4. **Deploy with Docker:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## License

This project is open source and available under the MIT License. 