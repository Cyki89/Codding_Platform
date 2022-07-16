import { useParams } from "react-router-dom";

import useAxios from "../../hooks/useAxios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import LoadingScreen from "../annimations/LoadingScreen";

import CodeExecutionForm from "./CodeExecutionForm";

const CodeExecution = () => {
  const { question_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [response, error, loading] = useAxios({
    axiosInstance: axiosPrivate,
    method: "get",
    url: `/questions/${question_id}`,
  });

  return loading ? (
    <LoadingScreen />
  ) : error ? (
    <div className="form-error">{error.message}</div>
  ) : (
    <CodeExecutionForm question_id={question_id} initialValues={response} />
  );
};

export default CodeExecution;
