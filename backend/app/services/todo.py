from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from ..models.todo import Todo
from ..models.user import User
from ..schemas.todo import TodoCreate, TodoUpdate

def get_todos(
    db: Session, 
    user_id: int, 
    completed: Optional[bool] = None,
    skip: int = 0, 
    limit: int = 100,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> List[Todo]:
    query = db.query(Todo).filter(Todo.user_id == user_id)
    
    # Filter by completion status
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    # Apply sorting
    sort_column = getattr(Todo, sort_by, Todo.created_at)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    return query.offset(skip).limit(limit).all()

def search_todos(
    db: Session, 
    user_id: int, 
    search: str,
    completed: Optional[bool] = None,
    skip: int = 0, 
    limit: int = 100,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> List[Todo]:
    query = db.query(Todo).filter(
        Todo.user_id == user_id,
        or_(
            Todo.title.ilike(f"%{search}%"),
            Todo.description.ilike(f"%{search}%")
        )
    )
    
    # Filter by completion status
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    # Apply sorting
    sort_column = getattr(Todo, sort_by, Todo.created_at)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    return query.offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int, user_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()

def create_todo(db: Session, todo: TodoCreate, user_id: int) -> Todo:
    db_todo = Todo(**todo.dict(), user_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate, user_id: int) -> Optional[Todo]:
    db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
    if db_todo:
        update_data = todo_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int, user_id: int) -> bool:
    db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
        return True
    return False 