from pydantic import BaseModel
from typing import List
class Question(BaseModel):
    """
    Represents a question in the system.
    """
    question: str
    choices: str
    answer: str

class ExamenResponse(BaseModel):
    questions: List[Question]