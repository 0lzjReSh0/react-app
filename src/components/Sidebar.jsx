// SideMenu.jsx
import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
// import { useUser } from "./UserContext";
const { Header, Content, Sider } = Layout;
import { useSelector } from "react-redux";
const Sidebar = () => {
  const user = useSelector((state) => state.user.user);

  const menuItems =
    user && user.snumber
      ? [
          {
            key: "1",
            label: <Link to="/personal-portrait">个人画像</Link>,
          },
          {
            key: "2",
            label: <Link to="/employment-predict">就业预测</Link>,
          },
          {
            key: "3",
            label: <Link to="/warning_analysis">预警分析</Link>,
          },
          {
            key: "sub",
            label: "学生群像",
            children: [
              {
                key: "5",
                label: <Link to="/teacher_view/grade_analysis">成绩分析</Link>,
              },
              {
                key: "6",
                label: (
                  <Link to="/teacher_view/consumption_analysis">消费分析</Link>
                ),
              },
            ],
          },
        ]
      : [
          {
            key: "4",
            label: <Link to="/">登录</Link>,
          },
        ];

  return (
    <Sider collapsible>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
