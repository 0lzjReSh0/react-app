// App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import PersonalPortrait from "./components/PersonalPortrait";
import EmploymentPredict from "./components/EmploymentPredict";
import Home from "./components/Home"
import { Layout, Menu, Dropdown, Breadcrumb, Button } from "antd";
import LogOut from "./components/LogOut";
import ConsumptionAnalysis from "./components/ConsumptionAnalysis";
import TeacherView from "./components/TeacherView";
const {Header, Content, Sider} = Layout;
// import LoginPage from "../components/LoginPage";
// import FunctionAnalysis from "../components/FunctionAnalysis";
import Cluster from "./components/Cluster";
import GradeAnalysis from "./components/Teacher";
import StableCluster from "./components/StableCluster";
import {useUser , UserProvider } from "./components/UserContext";
import Sidebar from "./components/Sidebar";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store/store";
import { actionTypes } from "./store/userReducer";
import ConsumptionCluster from "./components/ConsumptionCluster";
import Routine from "./components/Routine";
import RoutineCluster from "./components/RoutineCluster";
const AppBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      label: (
        <Link to={url}>
          {snippet}{" "}
          {/* Replace with logic for naming the breadcrumb based on the route */}
        </Link>
      ),
      key: url,
    };
  });

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      {breadcrumbItems.map((item) => (
        <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

const NoPermission = () => {
  return <div>无权查看</div>;
};
function App() {
  // const navigate = useNavigate();
  // const { user, setUser} = useUser();
  const user = useSelector((state) => state.user.user);
  // const dispatch = useDispatch();
  console.log(user);  
  const isEduUser = user?.snumber?.startsWith("edu");

  // const handleLogout = () => {
  //   dispatch({ type: actionTypes.CLEAR_USER });
  //   // setUser(null);
  //   navigate("/");
    
  // };
  return (
    // <UserProvider>
    <Router>
      <Header
        className="site-layout-background"
        style={{
          padding: 0,
          width: 1905,
          textAlign: "center",
          color: "white",
        }}
      >
        学生画像系统 {/* Student Portrait System */}
      </Header>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />

        <Layout style={{ minHeight: "100vh" }}>
          {user && (
            <Header
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div className="logo" />

              {<LogOut />}
            </Header>
          )}
          <Content style={{ margin: "0 16px" }}>
            <AppBreadcrumb />
            {/* <div style={{ padding: 24, background: "#fff", minHeight: 360 }}> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Home />} />
              <Route path="/personal-portrait" element={<PersonalPortrait />} />
              <Route
                path="/employment-predict"
                element={<EmploymentPredict />}
              />
              <Route path="/warning_analysis" element={<Home />} />

              <Route
                path="teacher_view/grade_analysis"
                element={isEduUser ? <GradeAnalysis /> : <NoPermission />}
              />
              <Route
                path="teacher_view/consumption_analysis"
                element={isEduUser ? <ConsumptionAnalysis /> : <NoPermission />}
              />
              <Route
                path="/teacher_view/cluster"
                element={isEduUser ? <Cluster /> : <NoPermission />}
              />
              <Route
                path="/teacher_view/"
                element={isEduUser ? <TeacherView /> : <NoPermission />}
              />
              <Route
                path="/teacher_view/stable_cluster"
                element={isEduUser ? <StableCluster /> : <NoPermission />}
              />
              <Route
                path="/teacher_view/consumption_cluster"
                element={isEduUser ? <ConsumptionCluster /> : <NoPermission />}
              />
              <Route
                path="/teacher_view/routine"
                element={isEduUser ? <Routine /> : <NoPermission />}
              />
              <Route
                path="/teacher_view/routine_cluster"
                element={isEduUser ? <RoutineCluster /> : <NoPermission />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
    // </UserProvider>
  );
}
const RootApp = () => {
  return (
    <Provider store={store}>
      {" "}
      {/* UserProvider 现在包裹整个 App 组件 */}
      <App />
    </Provider>
  );
};
export default RootApp;
