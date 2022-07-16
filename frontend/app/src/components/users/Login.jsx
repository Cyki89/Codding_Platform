import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const from = location.state?.from || "/";
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) setError(err.message);
      if (err.response.status === 401) setError(err.response.data.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <h2 className="form-header">Login Form</h2>
      <Form.Group className="mb-4">
        <Form.Label>Email</Form.Label>
        <Form.Control
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          type="text"
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          type="password"
          placeholder="Password"
        />
        <div className={error ? "form-error" : "hidden"}>{error}</div>
      </Form.Group>
      {!loading && (
        <Button className="btn-block btn-primary mt-2" type="submit">
          Login
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

export default Login;
