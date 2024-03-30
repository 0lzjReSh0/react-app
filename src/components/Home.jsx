import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Form, Input, Button, message } from "antd";
import { useUser } from "./UserContext";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
const { Title } = Typography;

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // const { setUser } = useUser();
  const dispatch = useDispatch();
  const onFinish = (values) => {
    const { username, password } = values;
    const csrfToken = Cookies.get("csrftoken"); // 获取 CSRF token
    const userInfo = { snumber: username };
    fetch("http://localhost:8000/api/user-profile/", {
      method: "POST",
      headers: {
        
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // 添加 CSRF token
      },
      credentials: "include", // 确保 cookies 用于跨域请求
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setIsLoggedIn(true);
          // setUser({ snumber: username });
          dispatch({ type: "SET_USER", payload: userInfo });

          // 判断用户名是否以 "edu" 开头
          if (username.startsWith("edu")) {
            message.success("Login success!"); // 显示成功消息
            navigate("/teacher_view/grade_analysis"); // 跳转到教师视图
          } else {
            navigate("/personal-portrait", { state: { snumber: username } }); // 跳转到个人画像页面
          }
          // 页面会在跳转后自动刷新
        } else {
          message.error("Login failed! Incorrect username or password.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        message.error("An error occurred during login. Please try again.");
      });
  };



  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Title style={{ fontFamily: "cursive", color: "rebeccapurple" }}>
        Student Portrait System
      </Title>
      {!isLoggedIn && (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default Home;
