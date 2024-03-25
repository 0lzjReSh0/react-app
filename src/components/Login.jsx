// HeaderWithLogout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUser } from "./UserContext";

const { Header } = Layout;

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser({ snumber: null }); // Set user to an empty object instead of null
    navigate("/");
  };


  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />} >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="logo" />
      {user.snumber && (
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Button type="text" color = "white" icon={<UserOutlined />} style={{ color: 'white', background: 'transparent' }}>
            {user?.snumber || "User"}
          </Button>
        </Dropdown>
      )}
    </Header>
  );
};

export default Login;
