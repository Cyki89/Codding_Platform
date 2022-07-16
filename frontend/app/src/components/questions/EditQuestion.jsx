import { useParams } from "react-router-dom";

import useAxios from "../../hooks/useAxios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import QuestionForm from "./QuestionForm";
import LoadingScreen from "../annimations/LoadingScreen";

const EditQuestion = () => {
  const { question_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [response, error, loading] = useAxios({
    axiosInstance: axiosPrivate,
    method: "get",
    url: `/questions/${question_id}`,
  });

  return loading ? (
    <LoadingScreen />
  ) : (
    <QuestionForm url={`/questions/${question_id}`} initialValues={response} />
  );
};

export default EditQuestion;
