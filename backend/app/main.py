from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from .routers import auth, todos
from .database import Base, engine, get_db, settings
from .models import user, todo  # Import models to register them
from .middleware import setup_middleware
import redis
import time
from datetime import datetime

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API",
    description="A production-ready todo list API with authentication, rate limiting, and security features",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],  # React development servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup security and logging middleware
setup_middleware(app)

# Include routers
app.include_router(auth.router)
app.include_router(todos.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Todo API", "version": "1.0.0", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health/detailed")
def detailed_health_check(db: Session = Depends(get_db)):
    """Comprehensive health check endpoint for monitoring systems."""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": settings.environment,
        "checks": {}
    }
    
    # Database health check
    try:
        start_time = time.time()
        db.execute(text("SELECT 1"))
        db_response_time = time.time() - start_time
        health_status["checks"]["database"] = {
            "status": "healthy",
            "response_time_ms": round(db_response_time * 1000, 2),
            "url": settings.database_url.split("@")[1] if "@" in settings.database_url else "hidden"
        }
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    # Redis health check (if configured)
    try:
        # Try to connect to Redis for rate limiting
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        start_time = time.time()
        r.ping()
        redis_response_time = time.time() - start_time
        health_status["checks"]["redis"] = {
            "status": "healthy",
            "response_time_ms": round(redis_response_time * 1000, 2)
        }
    except Exception:
        # Redis is optional, so don't fail overall health check
        health_status["checks"]["redis"] = {
            "status": "unavailable",
            "note": "Redis not configured or unavailable"
        }
    
    # Application metrics
    health_status["checks"]["application"] = {
        "status": "healthy",
        "uptime_seconds": round(time.time() - app.state.start_time, 2) if hasattr(app.state, 'start_time') else 0
    }
    
    return health_status

@app.on_event("startup")
async def startup_event():
    """Initialize application state on startup."""
    app.state.start_time = time.time()

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    pass 