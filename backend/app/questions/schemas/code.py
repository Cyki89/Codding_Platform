from datetime import datetime
from pydantic import BaseModel, UUID1, EmailStr

from utils.types import Text
from utils.schemas import Status



class TestCodeRequestSchema(BaseModel):
    code: Text
    tests: Text


class TestResponseSchema(BaseModel):
    status: int
    msg: str


class TestCodeResponseSchema(BaseModel):
    tests: list[TestResponseSchema]
    tests_passed: int
    tests_failed: int
    passed: bool
    execution_time: int | None
    error: str | None


class AttemptRequestSchema(BaseModel):
    code: Text


class AttemptValidationSchema(BaseModel):  
    question_id: UUID1
    user_id: UUID1
    user_email: EmailStr
    status: Status
    code: Text
    execution_time: int


class AttemptResponseSchema(TestCodeResponseSchema):
    ready_to_submission: bool
    submission_id: UUID1


class SubmissionRequestSchema(BaseModel):
    submission_id: UUID1


class SubmissionResponseSchema(AttemptValidationSchema):
    submission_id: UUID1
    submited_date: datetime
    submitted: int