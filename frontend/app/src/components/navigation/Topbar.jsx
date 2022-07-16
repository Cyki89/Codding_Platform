import React from "react";
import { Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/esm/Container";
import Badge from "react-bootstrap/Badge";

import useAuth from "../../hooks/useAuth";

const Topbar = () => {
  const { user, logout } = useAuth();
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="bg-third mb-2">
      <Container>
        <Navbar.Brand>Codding-Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {user && <Link to="/questions/add">Add new question</Link>}
          </Nav>
          <Nav>
            {user && (
              <>
                <Nav.Link>
                  <span>{user.email}</span>
                  <Badge pill className="bg-brand">
                    {user.rank_points} pts
                  </Badge>
                </Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="mr-3">
                  Login
                </Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topbar;
