import { Routes, Route, Outlet } from "react-router-dom";

import Layout from "../Layout";
import Home from "./Home";
import Missing from "./Missing";
import Unauthorized from "./Unauthorized";
import PersistLogin from "../functional/PersistLogin";
import ProtectedRoute from "../functional/ProtectedRoute";
import Register from "../users/Register";
import Login from "../users/Login";
import AddQuestion from "../questions/AddQuestion";
import QuestionList from "../questions/QuestionList";
import EditQuestion from "../questions/EditQuestion";
import CodeExecution from "../code_execution/CodeExecution";
import SubmissionList from "./../questions/SubmissionList";

const NORMAL_USER = 0;
const ADMIN_USER = 1;

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistLogin />}>
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="code/:question_id" element={<CodeExecution />} />
          </Route>
          <Route path="questions" element={<Outlet />}>
            <Route element={<ProtectedRoute />}>
              <Route path="" element={<QuestionList />} />
              <Route path="add" element={<AddQuestion />} />
              <Route path=":question_id" element={<EditQuestion />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path="submissions/:question_id"
              element={<SubmissionList />}
            />
          </Route>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
