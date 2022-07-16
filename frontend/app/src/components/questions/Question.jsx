import { useRef } from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import DeleteQuestionModal from "./DeleteQuestionModal";

import { LEVEL_MAPPING } from "../../constants/questions";

const Question = ({
  title,
  level,
  language,
  totalSubmissions,
  submissionRatio,
  questionId,
  onDelete,
}) => {
  const deleteQuestionModalRef = useRef();

  const openDeleteQuestionModal = () => {
    deleteQuestionModalRef.current.openModal();
  };

  return (
    <>
      <Card bg="dark" className="p-3 mx-2 my-3">
        <Stack direction="horizontal" className="mb-3">
          <Stack>
            <div className="fit-content">
              <div className="mb-2">
                <span
                  className={`badge-lvl badge-${LEVEL_MAPPING[
                    level
                  ].toLowerCase()} mr-2`}>
                  {LEVEL_MAPPING[level]}
                </span>{" "}
                <span className="fs-12 fg-white mr-2">{title}</span>
              </div>
              <div>
                <span className="fs-11 mr-3">
                  Accepted {submissionRatio}% of {totalSubmissions} submissions
                </span>
              </div>
              <div>
                <Link
                  className="fs-11 text-nowrap"
                  to={`/submissions/${questionId}`}>
                  See Submissions
                </Link>
              </div>
            </div>
          </Stack>
          <div className="fs-12 fg-brand">{language}</div>
        </Stack>
        <div className="question-btns-container">
          <Link
            className="btn-secondary text-nowrap mr-4"
            to={`/code/${questionId}`}>
            Train Question
          </Link>
          <Link
            className="btn-secondary text-nowrap mr-4"
            to={`/questions/${questionId}`}>
            Edit Question
          </Link>
          <button
            className="btn-secondary btn-delete text-nowrap d-none d-sm-block"
            onClick={openDeleteQuestionModal}>
            Delete Question
          </button>
        </div>
      </Card>
      <DeleteQuestionModal
        ref={deleteQuestionModalRef}
        onSubmit={() => onDelete(questionId)}
      />
    </>
  );
};

export default Question;
