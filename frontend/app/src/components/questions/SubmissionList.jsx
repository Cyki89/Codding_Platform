import { useParams } from "react-router";

import useAxios from "./../../hooks/useAxios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { python } from "@codemirror/lang-python";

import Submission from "./Submission";

import LoadingScreen from "../annimations/LoadingScreen";

const SubmissionList = () => {
  const { question_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [response, error, loading] = useAxios({
    axiosInstance: axiosPrivate,
    method: "get",
    url: `/submissions/${question_id}`,
  });

  return (
    <div>
      {loading && <LoadingScreen />}
      {error && (
        <div className={error ? "form-error" : "hidden"}>
          {error.response?.data.detail || error.message}
        </div>
      )}
      {response && (
        <>
          <h1 className="fg-white text-center">Submission List</h1>
          <div className="attempts-container">
            {response.map((submission, idx) => (
              <Submission
                key={idx}
                code={submission.code}
                submissionDate={submission.submited_date}
                executionTime={submission.execution_time}
                user={submission.user_email}
                extension={python}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubmissionList;
