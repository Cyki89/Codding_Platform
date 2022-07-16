import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAxiosFunction from "../../hooks/useAxiosFunction";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import QuestionForm from "./QuestionForm";

import LoadingScreen from "../annimations/LoadingScreen";

import {
  INITIAL_CODE,
  SAMPLE_TESTS,
  SUBMISSION_TESTS,
} from "../../constants/questions";

const INITIAL_VALUES = {
  title: "",
  level: "",
  language: "",
  initial_code: INITIAL_CODE,
  sample_tests: SAMPLE_TESTS,
  submission_tests: SUBMISSION_TESTS,
};

const AddQuestion = () => {
  return <QuestionForm url="/questions" initialValues={INITIAL_VALUES} />;
};

export default AddQuestion;
