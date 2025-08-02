# Full-Stack Todo Application

A modern full-stack todo application built with React, FastAPI, and PostgreSQL.

🚀 **CI/CD Status**: Testing deployment pipeline - Last updated: 2025-08-02

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Alembic** - Database migrations

### Frontend
- **React** - Frontend library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zustand** - Client state management

## Features

- 🔐 User authentication (register/login)
- ✅ Create, read, update, delete todos
- 📝 Todo descriptions
- ✔️ Mark todos as complete/incomplete
- 🎨 Modern, responsive UI
- 🚀 Real-time updates
- 🐳 Docker support

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (if running locally)
- Python 3.11+ (if running locally)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd fastApi-ToDo
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Start PostgreSQL (using Docker):
```bash
docker run --name postgres -e POSTGRES_DB=todoapp -e POSTGRES_USER=todouser -e POSTGRES_PASSWORD=todopass -p 5432:5432 -d postgres:15
```

6. Run the application:
```bash
uvicorn app.main:app --reload
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/token` - Login and get access token

### Todos
- `GET /todos/` - Get all todos for authenticated user
- `POST /todos/` - Create a new todo
- `GET /todos/{id}` - Get a specific todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://todouser:todopass@localhost:5432/todoapp
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
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

## Development

### Code Formatting
- Backend: `black .` and `flake8`
- Frontend: `prettier` and `eslint`

### Testing
- Backend: `pytest`
- Frontend: Add tests with React Testing Library

## Deployment

The application is containerized and can be deployed using Docker Compose on any platform that supports Docker.

For production deployment:
1. Update environment variables with secure values
2. Use environment-specific configuration
3. Set up SSL/TLS certificates
4. Configure proper database backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License. 