import Stack from "react-bootstrap/Stack";

import Sidebar from "./navigation/Sidebar";
import Topbar from "./navigation/Topbar";

import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Stack direction="horizontal" className="align-items-start">
      <div className="w-10 d-none d-lg-block">
        <Sidebar />
      </div>
      <div className="w-100">
        <Topbar />
        <Container fluid>
          <Outlet />
        </Container>
      </div>
    </Stack>
  );
};

export default Layout;
