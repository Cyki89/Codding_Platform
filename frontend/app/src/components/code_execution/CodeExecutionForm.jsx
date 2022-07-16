import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { python } from "@codemirror/lang-python";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAxiosFunction from "../../hooks/useAxiosFunction";
import useForm from "../../hooks/useForm";
import useRefreshToken from "../../hooks/useRefreshToken";

import CodeEditor from "../forms/CodeEditor";
import CodeInfoContainer from "./CodeInfoContainer";

import { LEVEL_MAPPING } from "../../constants/questions";

const CodeExecutionForm = ({ question_id, initialValues = {} }) => {
  const refreshAccess = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const [data, _, handleEditorChange] = useForm(initialValues);
  const [accepted, setAccepted] = useState();

  const [submissionId, setSubmissionId] = useState();

  const [response, error, loading, axiosFetch] = useAxiosFunction();

  const handleCheckCode = () => {
    axiosFetch({
      axiosInstance: axiosPrivate,
      method: "post",
      url: `/python/tests/`,
      requestConfig: { code: data.initial_code, tests: data.sample_tests },
    });
  };

  const handleAttemptSubmission = () => {
    axiosFetch({
      axiosInstance: axiosPrivate,
      method: "post",
      url: `/python/attempt/${question_id}`,
      requestConfig: { code: data.initial_code },
    });
  };

  const handleCodeSubmission = () => {
    axiosFetch({
      axiosInstance: axiosPrivate,
      method: "post",
      url: `/python/submission/${question_id}`,
      requestConfig: { submission_id: submissionId },
    });
  };

  useEffect(() => {
    setAccepted(false);
  }, [data.initial_code]);

  useEffect(() => {
    setAccepted(response && response.ready_to_submission);
    if (response?.submission_id) setSubmissionId(response.submission_id);
    if (response?.submitted) {
      refreshAccess();
      navigate("/questions", { replace: true });
    }
  }, [response]);

  return (
    <Row className="ms-auto">
      <Col xs={12} lg={5}>
        <div className="code-editor-question-title mb-3 mx-2">
          {data.level && (
            <span
              className={`badge-lvl badge-${LEVEL_MAPPING[
                data.level
              ].toLowerCase()} mr-2`}>
              {LEVEL_MAPPING[data.level]}
            </span>
          )}
          <span>{data.title}</span>
        </div>
        <CodeInfoContainer
          response={response}
          accepted={accepted}
          error={error?.message}
          loading={loading}
          description={data.description}
        />
      </Col>
      <Col xs={12} lg={7}>
        <CodeEditor
          title={"Solution"}
          name="initial_code"
          value={data.initial_code}
          setValue={handleEditorChange}
          extension={python}
          height={300}
        />
        <CodeEditor
          title={"Sample Tests"}
          name="sample_tests"
          value={data.sample_tests}
          setValue={handleEditorChange}
          extension={python}
          height={250}
        />
        <div className="code-editor-btns-group mx-2 mb-2">
          <button
            className="btn mx-3"
            onClick={handleCheckCode}
            disabled={loading}>
            Run Tests
          </button>
          {accepted ? (
            <button
              className="btn"
              onClick={handleCodeSubmission}
              disabled={loading}>
              Submit
            </button>
          ) : (
            <button
              className="btn"
              onClick={handleAttemptSubmission}
              disabled={loading}>
              Attempt
            </button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default CodeExecutionForm;
