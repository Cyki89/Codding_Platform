import uuid
from datetime import datetime
from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model

from config import get_settings
settings = get_settings()


class Question(Model):
    __keyspace__ = settings.keyspace
    question_id = columns.UUID(primary_key=True, default=uuid.uuid1)
    title = columns.Text(index=True)
    description = columns.Text(required=True)
    author_id = columns.UUID(required=True)
    level = columns.Integer(required=True)
    language = columns.Text(required=True)
    initial_code = columns.Text(required=True)
    sample_tests = columns.Text(required=True)
    submission_tests = columns.Text(required=True)
    date_added = columns.DateTime(default=datetime.now)
    correct_submissions = columns.Integer(default=0)
    total_submissions = columns.Integer(default=0)

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Question(title={self.title}, question_id={self.question_id})"


class QuestionSubmission(Model):
    __keyspace__ = settings.keyspace
    question_id = columns.UUID(primary_key=True)
    submission_id = columns.TimeUUID(primary_key=True, default=uuid.uuid1, clustering_order="DESC")
    user_id = columns.UUID(required=True, index=True)
    user_email = columns.Text(required=True)
    status = columns.Integer(required=True, index=True)
    submitted = columns.Integer(default=0, index=True)
    submited_date = columns.DateTime(default=datetime.now)
    code = columns.Text(required=True)
    execution_time = columns.Integer(required=True)

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"QuestionSubmission(submission_id={self.submission_id}, question_id={self.question_id}, user_id={self.user_id})"




