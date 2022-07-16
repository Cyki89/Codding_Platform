import { useEffect, useState, useRef } from "react";

import LoadingScreen from "../annimations/LoadingScreen";
import Question from "./Question";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAxiosFunction from "../../hooks/useAxiosFunction";
import Paginations from "./../navigation/Paginations";

import { PAGE_LIMIT, QUESTION_ENDPOINT } from "../../constants/questions";
import ErrorScreen from "../annimations/ErrorScreen";

const QuestionList = () => {
  const [questions, setQuestions] = useState();
  const axiosPrivate = useAxiosPrivate();

  const [currPage, setCurrPage] = useState(1);
  const lastPage = useRef(1);

  const [getResponse, getError, getLoading, axiosGetFetch] = useAxiosFunction();

  const [deleteResponse, deleteError, deleteLoading, axiosDeleteFetch] =
    useAxiosFunction();

  const handlePageChange = (page) => setCurrPage(page);

  const getQuestions = () => {
    let url = `${QUESTION_ENDPOINT}/`;
    url += `?page=${currPage}`;
    url += `&limit=${PAGE_LIMIT}`;

    axiosGetFetch({
      axiosInstance: axiosPrivate,
      method: "GET",
      url: url,
    });
  };

  useEffect(() => {
    getQuestions();
  }, [currPage]);

  useEffect(() => {
    if (getResponse) {
      setQuestions(getResponse.questions);

      const lastPageCalculated = Math.ceil(getResponse.count / PAGE_LIMIT);
      lastPage.current =
        lastPageCalculated < currPage ? currPage : lastPageCalculated;
    }
  }, [getResponse, currPage]);

  const handleDelete = async (questionId) => {
    await axiosDeleteFetch({
      axiosInstance: axiosPrivate,
      method: "delete",
      url: `/questions/${questionId}`,
    });

    setQuestions(
      questions.filter((question) => question.question_id !== questionId)
    );
  };

  return (
    <div>
      {getLoading || (deleteLoading && <LoadingScreen />)}
      {(getError || deleteError) && (
        <ErrorScreen>
          Unexpeceted Error: {getError.message || deleteError.message}
        </ErrorScreen>
      )}
      {questions && (
        <>
          <h1 className="fg-white text-center">Question List</h1>
          <div className="questions-container">
            {questions.map((question) => (
              <Question
                key={question.title}
                title={question.title}
                level={question.level}
                language={question.language}
                totalSubmissions={question.total_submissions}
                submissionRatio={question.submission_ratio}
                questionId={question.question_id}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {getResponse && getResponse.count > PAGE_LIMIT && (
            <Paginations
              currentPage={currPage}
              lastPage={lastPage.current}
              onChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QuestionList;
