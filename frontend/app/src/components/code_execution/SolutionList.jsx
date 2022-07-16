import { useParams } from "react-router";

import useAxios from "../../hooks/useAxios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { python } from "@codemirror/lang-python";

import Solution from "./Solution";

import LoadingScreen from "../annimations/LoadingScreen";

const AttemptList = () => {
  const { question_id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [response, error, loading] = useAxios({
    axiosInstance: axiosPrivate,
    method: "get",
    url: `/solutions/${question_id}`,
  });

  return (
    <div>
      {loading && <LoadingScreen />}
      <div className={error ? "form-error" : "hidden"}>{error?.message}</div>
      {response && (
        <div className="solutions-container">
          {response.map((attempt, idx) => (
            <Solution
              key={idx}
              code={attempt.code}
              submissionDate={attempt.submited_date}
              executionTime={attempt.execution_time}
              status={attempt.status}
              extension={python}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AttemptList;
