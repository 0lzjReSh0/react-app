// HeaderWithLogout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUser } from "./UserContext";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "../store/store";
import { actionTypes } from "../store/userReducer";

const { Header } = Layout;

const LogOut = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch({ type: actionTypes.CLEAR_USER });
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

export default LogOut;
