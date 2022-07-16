from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer

import config

from users import auth
from questions.models import Question, QuestionSubmission
from questions.schemas import questions as question_schemas


router = APIRouter(tags=['questions'])
settings = config.get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
COOKIE_EXPIRE_TIME = settings.cookie_expire_time
DB_SESSION = None


@router.get("/questions", response_model=question_schemas.QuestionsResponseSchema)
def get_question_list(page: int = 1, limit: int = 10):
    questions = Question.objects.all()

    start = (page-1) * limit
    end = page * limit
    1 / 0
    content = {
        'questions': list(questions)[start:end],
        'count': questions.count()
    }
    
    return content


@router.post(
    "/questions", 
    response_model=question_schemas.QuestionResponseSchema,
    status_code=status.HTTP_201_CREATED
)
def add_new_question(data: question_schemas.QuestionCreateSchema, token: str = Depends(oauth2_scheme)):
    user = auth.decode_access_token(token)
    request_data = data.dict().copy()
    request_data['author_id'] = user['user_id']

    question = Question(**request_data)
    question.save()

    return question


@router.get("/questions/{question_id}", response_model=question_schemas.QuestionResponseSchema)
def get_question(question_id: str, token: str = Depends(oauth2_scheme)):
    question = Question.objects.get(question_id=question_id)
    return question


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: str, token: str = Depends(oauth2_scheme)):
    Question.objects.filter(question_id=question_id).delete()
    QuestionSubmission.objects.filter(question_id=question_id).delete()

    return {}


@router.post("/questions/{question_id}", response_model=question_schemas.QuestionResponseSchema)
def update_question(question_id: str, data: question_schemas.QuestionEditSchema, token: str = Depends(oauth2_scheme)):
    question = Question.objects.get(question_id=question_id)
    
    raw_data = dict(question)
    raw_data.update(data.dict())
    
    updated_question = Question(**raw_data)
    updated_question.save()

    return updated_question


@router.get('/solutions/{question_id}', response_model=list[question_schemas.SolutionResponseSchema])
def get_solutions(question_id: str, token: str = Depends(oauth2_scheme)):
    user = auth.decode_access_token(token)
    
    solutions = QuestionSubmission.filter(question_id=question_id, user_id=user['user_id'])
                    
    return list(solutions)


@router.get('/submissions/{question_id}', response_model=list[question_schemas.SubmissionResponseSchema])
def get_submissions(question_id: str, token: str = Depends(oauth2_scheme)):
    user = auth.decode_access_token(token)

    submissions = QuestionSubmission.filter(question_id=question_id, submitted=1)
    if QuestionSubmission.filter(user_id=user['user_id']).count() == 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must first solve this question to see results"
        )

    return list(submissions)


