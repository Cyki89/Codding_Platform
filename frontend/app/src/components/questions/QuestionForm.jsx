import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { python } from "@codemirror/lang-python";
import { toast } from "react-toastify";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAxiosFunction from "../../hooks/useAxiosFunction";
import useForm from "../../hooks/useForm";

import CardInput from "../forms/CardInput";
import CardSelect from "../forms/CardSelect";
import CodeEditor from "../forms/CodeEditor";

import LoadingScreen from "../annimations/LoadingScreen";

import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "../../constants/questions";

const QuestionForm = ({ url, initialValues = {} }) => {
  const axiosPrivate = useAxiosPrivate();
  const [response, error, loading, axiosFetch] = useAxiosFunction();
  const [data, handleInputChange, handleEditorChange] = useForm(initialValues);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosFetch({
      axiosInstance: axiosPrivate,
      method: "post",
      url: url,
      requestConfig: data,
    });
  };

  const showUnknownError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    if (response) navigate("/questions", { replace: true });
  }, [response]);

  useEffect(() => {
    if (!error) return setErrors(null);

    if (!error.response.data) {
      showUnknownError(error.message);
      return;
    }

    const errorsObj = {};
    const errorDetails = error.response.data.detail;
    for (const detail of errorDetails) {
      const location = detail.loc[1];
      const msg = detail.msg.charAt(0).toUpperCase() + detail.msg.slice(1);

      errorsObj[location] = msg;
    }
    console.log(errorsObj);
    setErrors(errorsObj);
  }, [error]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <Form>
      <Row className="ms-auto">
        <Col xs={12} lg={5}>
          <CardInput
            title="Question Title"
            name="title"
            value={data.title}
            setValue={handleInputChange}
            placeholder="Enter Question Title"
            error={errors && errors.title}
          />
          <CardSelect
            title="Question Language"
            name="language"
            value={data.language}
            setValue={handleInputChange}
            error={errors && errors.language}
            options={LANGUAGE_OPTIONS}
          />
          <CardSelect
            title="Question Level"
            name="level"
            value={data.level}
            setValue={handleInputChange}
            error={errors && errors.level}
            options={LEVEL_OPTIONS}
          />
          <CardInput
            title="Question Description"
            name="description"
            value={data.description}
            setValue={handleInputChange}
            placeholder="Enter Question Description"
            error={errors && errors.description}
            as="textarea"
            rows={6}
          />
          <CodeEditor
            title={"Initial Code"}
            name="initial_code"
            extension={python}
            value={data.initial_code}
            setValue={handleEditorChange}
            height={150}
            error={errors && errors.initial_code}
          />
        </Col>
        <Col xs={12} lg={7}>
          <CodeEditor
            title={"Sample Tests"}
            name="sample_tests"
            extension={python}
            value={data.sample_tests}
            setValue={handleEditorChange}
            height={268}
            error={errors && errors.sample_tests}
          />
          <CodeEditor
            title={"Submission Tests"}
            name="submission_tests"
            extension={python}
            value={data.submission_tests}
            setValue={handleEditorChange}
            height={300}
            error={errors && errors.submission_tests}
          />
          <div className="code-editor-btns-group mx-2 mb-2">
            <button className="btn" type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default QuestionForm;
