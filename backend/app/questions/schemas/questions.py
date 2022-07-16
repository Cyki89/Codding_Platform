from datetime import datetime
from enum import Enum
from pydantic import BaseModel, UUID1, validator, root_validator
from users.models import User

from utils.types import Text
from utils.schemas import ValidatedEnum, IntValidatedEnum, Status
from questions.models import Question


class Level(IntValidatedEnum):
    easy = 1
    medium = 2
    hard = 3


class Language(ValidatedEnum, Enum):
    Python = 'Python'
    JavaScript = 'JavaScript'
    Cpp = 'C++'


class QuestionRequestSchema(BaseModel):
    title: Text
    description: Text
    level: Level
    language: Language
    initial_code: Text
    sample_tests: Text
    submission_tests: Text


class QuestionCreateSchema(QuestionRequestSchema):
    @validator("title")
    def title_available(cls, v, values, **kwargs):
        q = Question.objects.filter(title=v) 
        if q.count() != 0:
            raise ValueError("Title is not available")

        return v


class QuestionEditSchema(QuestionRequestSchema):
    question_id: UUID1

    @root_validator()
    def title_available(cls, values):
        question = Question.objects.get(question_id = values['question_id'])
        if values['title'] == question.title:
            return values
        
        q = Question.objects.filter(title=values['title']) 
        if q.count() != 0:
            raise ValueError("Title is not available")

        return values


class QuestionResponseSchema(BaseModel):
    title:Text 
    question_id: UUID1 
    description: Text 
    author_id: UUID1 
    level: Level 
    language: Language 
    initial_code: Text | None
    sample_tests: Text 
    submission_tests: Text | None
    date_added: datetime
    correct_submissions: int
    total_submissions: int
    submission_ratio: float | None      

    @validator('submission_ratio', always=True)
    def get_submission_ratio(cls, v, values):
        return (
            round(values['correct_submissions'] / values['total_submissions'] * 100)
            if values['total_submissions'] > 0 else 0
        )


class QuestionsResponseSchema(BaseModel):
    questions: list[QuestionResponseSchema]
    count: int


class SolutionResponseSchema(BaseModel):
    submited_date: datetime
    execution_time: int
    status: Status
    code: str

    @validator('submited_date', always=True)
    def get_submited_date(cls, v, values):
        return v.strftime('%Y-%m-%d %H:%M:%S')


class SubmissionResponseSchema(BaseModel):
    submited_date: datetime
    execution_time: int
    user_email: str | None
    code: str

    @validator('submited_date', always=True)
    def get_submited_date(cls, v, values):
        return v.strftime('%Y-%m-%d %H:%M:%S')