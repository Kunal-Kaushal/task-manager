from fastapi import APIRouter, HTTPException
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher
from app.database import db
from app.models import UserRegister, UserLogin
from app.auth import create_access_token

router = APIRouter()
hasher = PasswordHash((BcryptHasher(),))

@router.post("/register")
async def register(user: UserRegister):
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hasher.hash(user.password)
    result = await db.users.insert_one({"email": user.email, "password": hashed, "name": user.name})
    token = create_access_token(str(result.inserted_id))
    return {"token": token, "user": {"email": user.email, "name": user.name}}

@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not hasher.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(db_user["_id"]))
    return {"token": token, "user": {"email": db_user["email"], "name": db_user["name"]}}
