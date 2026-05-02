# from sqlalchemy import Column, Integer, String, Boolean
# from database import Base

# class ToDo(Base):
#     __tablename__ = 'Todos'

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String, nullable=True)
#     done = Column(Boolean, default=False)


from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# ─── EXISTING model (updated) ────────────────────────────────────────────────


class User(Base):                          # NEW — stores registered users
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Back-reference so user.todos works
    todos = relationship("ToDo", back_populates="owner")


class Category(Base):                      # NEW — task labels/categories
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#6366f1")   # hex color shown as badge
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User")


class ToDo(Base):
    __tablename__ = "Todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    done = Column(Boolean, default=False)

    # ── NEW fields ──────────────────────────────────────────────────────────
    deadline = Column(DateTime, nullable=True)           # task due date/time
    priority = Column(String, default="medium")          # low | medium | high
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # ────────────────────────────────────────────────────────────────────────

    owner = relationship("User", back_populates="todos")
    category = relationship("Category")
