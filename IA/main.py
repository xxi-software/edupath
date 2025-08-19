from generateExam import generate_exam
from Question import ExamenResponse
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi import UploadFile, File

app = FastAPI(
    title="EduPath API",
    description="API for EduPath, an educational platform.",
    version="1.0.0",
    detail="API for generating exams based on PDF documents."
)

@app.get("/")
async def root():
    return {"message": "Welcome to the EduPath API"}


@app.post("/generate_exam", response_model=ExamenResponse)
async def generate_exam_endpoint(
    file: UploadFile = File(...),
    questions: int = 5
) -> ExamenResponse:
    return await generate_exam(file, questions)
