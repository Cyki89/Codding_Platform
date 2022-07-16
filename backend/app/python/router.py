import uuid
import os
import shutil

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

import config
from users import auth
from users.models import User
from questions.models import Question, QuestionSubmission
from questions.schemas import code as code_schemas
from python.code_execution.test_framework import get_user_tests_response

router = APIRouter(tags=['python'])
settings = config.get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


CODE_EXECUTION_DIR = settings.base_dir / 'python' / 'code_execution'
TESTS_FILE = CODE_EXECUTION_DIR / 'test_cases.py'
SUBMISSION_TEST_FILES = CODE_EXECUTION_DIR / 'submission_tests.py'
SOLUTION_FILE = CODE_EXECUTION_DIR / 'solution.py'


def _perform_tests(code, tests):
    temp_dir = CODE_EXECUTION_DIR / str(uuid.uuid1())
    os.mkdir(temp_dir)
    shutil.copy(CODE_EXECUTION_DIR / 'test_framework.py', temp_dir / 'test_framework.py')
    
    solution_path = temp_dir / 'solution.py'
    tests_path = temp_dir / 'tests.py'

    with open(solution_path, 'w') as solution_file, open(tests_path, 'w') as tests_file:
        solution_file.write(code)
        tests_file.write(tests)
 
    response = get_user_tests_response(test_file=tests_path)

    if os.path.exists(temp_dir):
         shutil.rmtree(temp_dir)

    return response


@router.post('/python/tests/', response_model=code_schemas.TestCodeResponseSchema)
def execute_sample_tests(data: code_schemas.TestCodeRequestSchema, token: str = Depends(oauth2_scheme)):
    code, tests = data.code, data.tests
    response = _perform_tests(code, tests)
    
    return response


@router.post('/python/attempt/{question_id}', response_model=code_schemas.AttemptResponseSchema)
def execute_submission_tests(question_id: str, data: code_schemas.AttemptRequestSchema, token: str = Depends(oauth2_scheme)):
    user = auth.decode_access_token(token)
    question = Question.objects.get(question_id=question_id) 
    
    response = _perform_tests(data.code, question.submission_tests)
    submission_data = code_schemas.AttemptValidationSchema(
        code=data.code,
        question_id=question_id,
        user_id=user['user_id'],
        user_email=user['email'],
        status=int(response['passed']),
        execution_time=response['execution_time']
    )

    if submission_data.status == code_schemas.Status.passed:
        question.correct_submissions += 1
    question.total_submissions += 1
    question.save()

    submission = QuestionSubmission.create(**submission_data.dict())
    response['ready_to_submission'] = bool(submission.status)
    response['submission_id'] = submission.submission_id

    return response


@router.post('/python/submission/{question_id}', response_model=code_schemas.SubmissionResponseSchema)
def submit_answer(question_id: str, data: code_schemas.SubmissionRequestSchema, token: str = Depends(oauth2_scheme)):
    user = auth.decode_access_token(token)
    user_obj = User.objects.get(user_id = user['user_id'])
    
    submission = QuestionSubmission.get(
        question_id=question_id, submission_id=data.submission_id
    )
    submission['submitted'] = 1
    submission.save()

    question = Question.objects.get(question_id=question_id)
    level_points_multiplicator = 10
    points = question.level * level_points_multiplicator

    q = QuestionSubmission.objects.filter(
        question_id=question_id, 
        user_id=user['user_id'], 
        status=code_schemas.Status.passed
    )
    if q.count() == 1:
        user_obj.rank_points += points
        user_obj.save()
        
    return submission