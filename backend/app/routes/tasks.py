from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import db
from app.models import TaskCreate, TaskUpdate
from app.auth import get_current_user

router = APIRouter()

def task_serializer(task) -> dict:
    return {"id": str(task["_id"]), "title": task["title"], "description": task["description"], "stage": task["stage"], "user_id": task["user_id"]}

@router.get("/")
async def get_tasks(user_id: str = Depends(get_current_user)):
    tasks = await db.tasks.find({"user_id": user_id}).to_list(100)
    return [task_serializer(t) for t in tasks]

@router.post("/", status_code=201)
async def create_task(task: TaskCreate, user_id: str = Depends(get_current_user)):
    doc = {**task.model_dump(), "user_id": user_id}
    result = await db.tasks.insert_one(doc)
    doc["_id"] = result.inserted_id
    return task_serializer(doc)

@router.put("/{task_id}")
async def update_task(task_id: str, task: TaskUpdate, user_id: str = Depends(get_current_user)):
    updates = {k: v for k, v in task.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id), "user_id": user_id}, {"$set": updates}, return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_serializer(result)

@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: str, user_id: str = Depends(get_current_user)):
    result = await db.tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
