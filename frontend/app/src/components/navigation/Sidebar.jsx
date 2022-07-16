import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import logo from "../../assets/logo.svg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column align-items-center">
        <img src={logo} width="70" height="70" className="mt-2 mb-5" alt="" />
        <Link className="sidebar-link mb-5" to="/">
          Home
        </Link>
        <Link className="sidebar-link mb-5" to="/questions">
          Questions
        </Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
