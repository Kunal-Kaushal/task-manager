from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class Stage(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    stage: Stage = Stage.TODO

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    stage: Optional[Stage] = None
