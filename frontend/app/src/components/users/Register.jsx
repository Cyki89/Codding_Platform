import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axios from "../../api/axios";
import useAxiosFunction from "../../hooks/useAxiosFunction";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [response, error, loading, axiosFetch] = useAxiosFunction();

  const [unknownError, setUnknownError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setUnknownError("");
    setEmailError("");
    setPasswordError("");

    register();
  };

  const register = () => {
    axiosFetch({
      axiosInstance: axios,
      method: "post",
      url: "/signup",
      requestConfig: {
        email,
        password,
        password_confirm: passwordConfirmation,
      },
    });
  };

  useEffect(() => {
    if (response) navigate("/", { replace: true });
  }, [response]);

  useEffect(() => {
    setEmailError("");
  }, [email]);

  useEffect(() => {
    setPasswordError("");
  }, [password, passwordConfirmation]);

  useEffect(() => {
    if (!error) return;

    if (!error.response.data) {
      setUnknownError(error.message);
      return;
    }

    const errorDetails = error.response.data.detail;
    for (const detail of errorDetails) {
      const location = detail.loc[1];
      const msg = detail.msg.charAt(0).toUpperCase() + detail.msg.slice(1);

      if (location === "email") setEmailError(msg);
      if (location === "password_confirm") setPasswordError(msg);
    }
  }, [error]);

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <h2 className="form-header">Register Account</h2>
      <Form.Group className="mb-4">
        <Form.Label>Email</Form.Label>
        <Form.Control
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          type="text"
          placeholder="Enter email"
        />
        <div className={emailError ? "form-error" : "hidden"}>{emailError}</div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          type="password"
          placeholder="Password"
        />
        <div className={passwordError ? "form-error" : "hidden"}>
          {passwordError}
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="form-input"
          type="password"
          placeholder="Password"
        />
        <div className={passwordError ? "form-error" : "hidden"}>
          {passwordError}
        </div>
        <div className={unknownError ? "form-error" : "hidden"}>
          Unexpected Error: {unknownError}
        </div>
      </Form.Group>
      {!loading && (
        <Button className="btn-block btn-primary mt-2" type="submit">
          Register
        </Button>
      )}
      {loading && (
        <Button className="btn-block btn-primary mt-2" disabled>
          <Spinner animation="border" />
        </Button>
      )}
    </Form>
  );
};

export default Register;
