from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
import json
import io
from ..database import get_db
from ..models.user import User
from ..models.todo import Todo
from ..schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from pydantic import BaseModel

class TodosResponse(BaseModel):
    todos: List[TodoResponse]
    total: int
    skip: int
    limit: int
from ..services.auth import get_current_active_user
from ..services.todo import get_todos, get_todo, create_todo, update_todo, delete_todo, search_todos

router = APIRouter(
    prefix="/todos",
    tags=["todos"],
    dependencies=[Depends(get_current_active_user)],
)

@router.get("/", response_model=TodosResponse)
def read_todos(
    skip: int = Query(0, ge=0, description="Number of todos to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of todos to return"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    sort_by: str = Query("created_at", description="Sort by field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Get total count for pagination
    total_query = db.query(Todo).filter(Todo.user_id == current_user.id)
    
    if search:
        total_query = total_query.filter(
            (Todo.title.ilike(f"%{search}%")) | 
            (Todo.description.ilike(f"%{search}%"))
        )
    
    if completed is not None:
        total_query = total_query.filter(Todo.completed == completed)
    
    total = total_query.count()
    
    # Get paginated todos
    if search:
        todos = search_todos(
            db, 
            user_id=current_user.id, 
            search=search,
            completed=completed,
            skip=skip, 
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order
        )
    else:
        todos = get_todos(
            db, 
            user_id=current_user.id, 
            completed=completed,
            skip=skip, 
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order
        )
    
    return TodosResponse(
        todos=[TodoResponse.model_validate(todo) for todo in todos],
        total=total,
        skip=skip,
        limit=limit
    )

@router.post("/", response_model=TodoResponse)
def create_new_todo(
    todo: TodoCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return create_todo(db=db, todo=todo, user_id=current_user.id)

@router.get("/analytics", response_model=dict)
def get_todo_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get todo analytics for the current user"""
    total_todos = db.query(Todo).filter(Todo.user_id == current_user.id).count()
    completed_todos = db.query(Todo).filter(
        Todo.user_id == current_user.id, 
        Todo.completed == True
    ).count()
    pending_todos = total_todos - completed_todos
    completion_rate = (completed_todos / total_todos * 100) if total_todos > 0 else 0
    
    return {
        "total_todos": total_todos,
        "completed_todos": completed_todos,
        "pending_todos": pending_todos,
        "completion_rate": round(completion_rate, 2)
    }

@router.get("/{todo_id}", response_model=TodoResponse)
def read_todo(
    todo_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_todo = get_todo(db, todo_id=todo_id, user_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@router.put("/{todo_id}", response_model=TodoResponse)
def update_existing_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_todo = update_todo(db, todo_id=todo_id, todo_update=todo_update, user_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@router.delete("/{todo_id}")
def delete_existing_todo(
    todo_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not delete_todo(db, todo_id=todo_id, user_id=current_user.id):
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}

@router.get("/export/{format}")
def export_todos(
    format: str,
    search: Optional[str] = Query(None, description="Search in title and description"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    sort_by: str = Query("created_at", description="Sort by field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export todos for the current user with optional filtering"""
    # Validate format
    if format not in ["json", "csv"]:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'json' or 'csv'.")
    
    # Get filtered todos
    if search:
        todos = search_todos(
            db, 
            user_id=current_user.id, 
            search=search,
            completed=completed,
            skip=0, 
            limit=1000,  # Export limit
            sort_by=sort_by,
            sort_order=sort_order
        )
    else:
        todos = get_todos(
            db, 
            user_id=current_user.id, 
            completed=completed,
            skip=0, 
            limit=1000,  # Export limit
            sort_by=sort_by,
            sort_order=sort_order
        )
    
    if format == "json":
        todos_data = [TodoResponse.model_validate(todo).model_dump() for todo in todos]
        # Convert datetime objects to ISO format strings for JSON serialization
        for todo in todos_data:
            todo['created_at'] = todo['created_at'].isoformat() if isinstance(todo['created_at'], datetime) else todo['created_at']
            if todo['updated_at']:
                todo['updated_at'] = todo['updated_at'].isoformat() if isinstance(todo['updated_at'], datetime) else todo['updated_at']
        
        json_str = json.dumps(todos_data, indent=2)
        buffer = io.StringIO(json_str)
        
        return StreamingResponse(
            io.BytesIO(buffer.getvalue().encode()),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=todos.json"}
        )
    
    elif format == "csv":
        import csv
        csv_buffer = io.StringIO()
        writer = csv.writer(csv_buffer)
        
        # Write header
        writer.writerow(["ID", "Title", "Description", "Completed", "Created At", "Updated At"])
        
        # Write data
        for todo in todos:
            todo_data = TodoResponse.model_validate(todo).model_dump()
            writer.writerow([
                todo_data['id'],
                todo_data['title'],
                todo_data['description'] or '',
                todo_data['completed'],
                todo_data['created_at'].isoformat() if isinstance(todo_data['created_at'], datetime) else todo_data['created_at'],
                todo_data['updated_at'].isoformat() if todo_data['updated_at'] and isinstance(todo_data['updated_at'], datetime) else (todo_data['updated_at'] or '')
            ])
        
        csv_content = csv_buffer.getvalue()
        csv_buffer.close()
        
        return StreamingResponse(
            io.BytesIO(csv_content.encode()),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=todos.csv"}
        ) 