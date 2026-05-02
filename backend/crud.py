# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# from sqlalchemy.orm import Session
# from database import get_db
# from models import ToDo
# from typing import List, Optional

# router = APIRouter()

# # @app.get("/")
# # async def read_root():
# #     return {"message": "Hello, World!"}

# # @app.get('/greet/{name}')
# # async def greet_name(name: str):
# #     return {"message": f"Hello, {name}!"}


# class ToDoCreate(BaseModel):
#     title: str
#     description: Optional[str] = None
#     done: bool


# class ToDoResponse(ToDoCreate):
#     id: int


# @router.get('/', response_model=List[ToDoResponse])
# async def show_Todos(db: Session = Depends(get_db)):
#     return db.query(ToDo).all()


# @router.post('/', response_model=ToDoResponse)
# async def create_todo(todo: ToDoCreate, db: Session = Depends(get_db)):
#     new_todo = ToDo(
#         title=todo.title,
#         description=todo.description,
#         done=todo.done
#     )
#     db.add(new_todo)
#     db.commit()
#     db.refresh(new_todo)
#     return new_todo

# @router.get('/{todo_id}', response_model=ToDoResponse)
# async def update_todo(todo_id: int, db: Session = Depends(get_db)):
#     db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
#     if not db_todo:
#         raise HTTPException(status_code=404, detail="Todo not found")
#     return db_todo

# @router.put('/{todo_id}', response_model=ToDoResponse)
# async def update_todo(todo_id: int, todo: ToDoCreate, db: Session = Depends(get_db) ):
#     db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
#     if not db_todo:
#         raise HTTPException(status_code=404, detail="Todo not found")
#     db_todo.title = todo.title
#     db_todo.description = todo.description
#     db_todo.done = todo.done
#     db.commit()
#     return db_todo

# @router.delete('/{todo_id}')
# async def delete_todo(todo_id: int, db: Session = Depends(get_db)):
#     db_todo = db.query(ToDo).filter(ToDo.id == todo_id).first()
#     if not db_todo:
#         raise HTTPException(status_code=404, detail="Todo not found")
#     db.delete(db_todo)
#     db.commit()
#     return {"message": "Todo deleted successfully!"}

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import ToDo, User, Category
from typing import List, Optional
from datetime import datetime, timedelta

# ── NEW: auth imports ────────────────────────────────────────────────────────
from passlib.context import CryptContext
from jose import JWTError, jwt
# ─────────────────────────────────────────────────────────────────────────────

router = APIRouter()

# ── NEW: JWT config — change SECRET_KEY before deploying! ───────────────────
SECRET_KEY = "change-this-to-a-random-secret-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24   # tokens last 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# ─────────────────────────────────────────────────────────────────────────────


# ═══════════════════════════════════════════════════════════════════════════════
# Pydantic schemas
# ═══════════════════════════════════════════════════════════════════════════════

class UserCreate(BaseModel):      # used for registration
    username: str
    email:    str
    password: str


class UserLogin(BaseModel):       # NEW — used only for login (no email needed)
    username: str
    password: str


class UserResponse(BaseModel):             # NEW
    id:       int
    username: str
    email:    str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):            # NEW
    access_token: str
    token_type:   str


class CategoryCreate(BaseModel):           # NEW
    name:  str
    color: Optional[str] = "#6366f1"


class CategoryResponse(CategoryCreate):   # NEW
    id: int

    class Config:
        from_attributes = True


class ToDoCreate(BaseModel):
    title:       str
    description: Optional[str] = None
    done:        bool = False
    # ── NEW fields ──────────────────────────────────────────────────────────
    deadline:    Optional[datetime] = None
    priority:    Optional[str] = "medium"
    category_id: Optional[int] = None
    # ────────────────────────────────────────────────────────────────────────


class ToDoResponse(ToDoCreate):
    id: int

    class Config:
        from_attributes = True


# ═══════════════════════════════════════════════════════════════════════════════
# NEW: Auth helpers
# ═══════════════════════════════════════════════════════════════════════════════

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    """Sign a JWT containing the user's username as 'sub'."""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    """Return username from token, or raise HTTPException 401."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


# ═══════════════════════════════════════════════════════════════════════════════
# NEW: Auth routes
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/register", response_model=UserResponse, tags=["Auth"])
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user. Raises 400 if username or email is already taken."""
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse, tags=["Auth"])
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Return a JWT if credentials are valid."""
    db_user = get_user_by_username(db, user.username)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=401, detail="Wrong username or password")
    token = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}


# ═══════════════════════════════════════════════════════════════════════════════
# NEW: Category routes
# ═══════════════════════════════════════════════════════════════════════════════

def _get_current_user(token: str, db: Session) -> User:
    """Shared helper used by every protected route."""
    username = decode_token(token)
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/categories", response_model=List[CategoryResponse], tags=["Categories"])
async def get_categories(token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    return db.query(Category).filter(Category.user_id == user.id).all()


@router.post("/categories", response_model=CategoryResponse, tags=["Categories"])
async def create_category(cat: CategoryCreate, token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    new_cat = Category(name=cat.name, color=cat.color, user_id=user.id)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@router.delete("/categories/{cat_id}", tags=["Categories"])
async def delete_category(cat_id: int, token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    db_cat = db.query(Category).filter(Category.id == cat_id,
                                       Category.user_id == user.id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted"}


# ═══════════════════════════════════════════════════════════════════════════════
# UPDATED: Todo routes (now user-scoped + new fields)
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/", response_model=List[ToDoResponse], tags=["Todos"])
async def show_todos(token: str, db: Session = Depends(get_db)):
    # NEW: filter by owner so users only see their own tasks
    user = _get_current_user(token, db)
    return db.query(ToDo).filter(ToDo.owner_id == user.id).all()


@router.post("/", response_model=ToDoResponse, tags=["Todos"])
async def create_todo(todo: ToDoCreate, token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    new_todo = ToDo(
        title=todo.title,
        description=todo.description,
        done=todo.done,
        deadline=todo.deadline,      # NEW
        priority=todo.priority,      # NEW
        category_id=todo.category_id,   # NEW
        owner_id=user.id,            # NEW
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@router.get("/{todo_id}", response_model=ToDoResponse, tags=["Todos"])
async def get_todo(todo_id: int, token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id,
                                    ToDo.owner_id == user.id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


@router.put("/{todo_id}", response_model=ToDoResponse, tags=["Todos"])
async def update_todo(todo_id: int, todo: ToDoCreate, token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id,
                                    ToDo.owner_id == user.id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.title = todo.title
    db_todo.description = todo.description
    db_todo.done = todo.done
    db_todo.deadline = todo.deadline    # NEW
    db_todo.priority = todo.priority    # NEW
    db_todo.category_id = todo.category_id  # NEW
    db.commit()
    db.refresh(db_todo)
    return db_todo


@router.delete("/{todo_id}", tags=["Todos"])
async def delete_todo(todo_id: int, token: str, db: Session = Depends(get_db)):
    user = _get_current_user(token, db)
    db_todo = db.query(ToDo).filter(ToDo.id == todo_id,
                                    ToDo.owner_id == user.id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted successfully!"}
