import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Tabs,
  Typography,
  List,
  Tag,
  Descriptions,
  Table,
  Col,
  Row
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const PersonalPortrait = () => {
  const [studentGrades, setStudentGrades] = useState([]);
  const [evaluation, setEvaluation] = useState("");
  const loggedInUser = useSelector((state) => state.user.user);
  const location = useLocation();
  const [retakeInfo, setRetakeInfo] = useState([]);
  const [consumeInfo, setConsumeInfo] = useState([]);
  const studentNumber = location.state?.snumber || loggedInUser.snumber;
  const [stats, setStats] = useState([]);
  const [portraits, setPortraits] = useState([]);

  useEffect(() => {
    if (studentNumber) {
      fetch(`http://localhost:8000/api/grades/${studentNumber}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const grades = data.grades.data;
          setStudentGrades(
            grades.map((grade) => ({
              subject: grade.course_name,
              score: grade.student_grade,
              average: grade.average_grade,
            }))
          );
          setEvaluation(data.grades.commentary || "");
          setStats(data.grades.stats)
          setRetakeInfo(data.grades.retake_courses)
          setConsumeInfo(data.grades.consume_data)
          setPortraits(data.grades.portrait)
          
          

        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [studentNumber]);
  console.log(portraits);

  const strengthsData = studentGrades.filter(
    (grade) => grade.score > grade.average
  );
  const weaknessesData = studentGrades.filter(
    (grade) => grade.score < grade.average
  );
    const renderEvaluation = () => (
      <Descriptions title="详情" bordered column={1} size="small">
        <Descriptions.Item label="平均成绩">
          {stats.grade_avg}
        </Descriptions.Item>
        <Descriptions.Item label="优势课程">
          {strengthsData.map((data) => data.subject).join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label="劣势课程">
          {weaknessesData.map((data) => data.subject).join(", ")}
        </Descriptions.Item>
        {/* <Descriptions.Item label="成绩评价">{evaluation}</Descriptions.Item> */}
        <Descriptions.Item label="成绩稳定性">
          {stats.grade_std}
        </Descriptions.Item>
        <Descriptions.Item label="成绩波动范围">
          {stats.grade_range}
        </Descriptions.Item>
        <Descriptions.Item label="是否有挂科">
          {retakeInfo.length > 0 ? "是" : "否"}
        </Descriptions.Item>
      </Descriptions>
    );
  const renderConsumeInfoTable = () => {
    // Define the columns for the Ant Design Table
    const columns = [
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        // Assuming the data comes as numbers, format the amounts to two decimal places
        render: (amount) =>
          amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      },
    ];

    // Map the consumeInfo data to the format expected by the Table component
    const dataSource = [
      { key: "1", category: "Food", amount: consumeInfo.food },
      { key: "2", category: "Shower", amount: consumeInfo.shower },
      { key: "3", category: "Borrow", amount: consumeInfo.borrow },
      { key: "4", category: "Shopping", amount: consumeInfo.shopping },
      { key: "5", category: "Others", amount: consumeInfo.others },
    ];

    return (
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    );
  };
  const renderRadarChart = (title, data) => (
    <Card title={title}>
      <RadarChart outerRadius={90} width={730} height={300} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Student"
          dataKey="score"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.7}
        />
        <Radar
          name="Average"
          dataKey="average"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.4}
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </Card>
  );
  const renderRetakeInfo = () => (
    <div>
      <Title level={4}>Retake Information</Title>
      {retakeInfo.length > 0 ? (
        <List
          bordered
          dataSource={retakeInfo}
          renderItem={(item) => (
            <List.Item>
              <Text>{item.course_name}</Text>
              <Tag color="volcano">have retaked</Tag>
            </List.Item>
          )}
        />
      ) : (
        <Text style={{ fontSize: "16px", color: "green" }}>
          No failed course record
        </Text>
      )}
    </div>
  );
  const tabItems = [
    {
      label: "全部成绩",
      key: "1",
      children: (
        <Card>
          <BarChart width={730} height={250} data={studentGrades}>
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" />
            {/* <Bar dataKey="average" fill="#82ca9d" /> */}
          </BarChart>
        </Card>
      ),
    },
    {
      label: "强项",
      key: "2",
      children: renderRadarChart("优势项", strengthsData),
    },
    {
      label: "薄弱环节",
      key: "3",
      children: renderRadarChart("薄弱项", weaknessesData),
    },
    {
      label: "补考信息",
      key: "4",
      children: renderRetakeInfo(),
    },
    {
      label: "消费信息",
      key: "5",
      children: renderConsumeInfoTable(),
    },
    // Add more tabs as necessary
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content
        style={{
          width: "80%", // Or a fixed width like 1200px
          maxWidth: "1200px", // Ensures content does not exceed a max width
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#fff", // Assuming you want a white background
        }}
      >
        {/* <div style={{ width: "100%", flex: 1 }}> */}
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          <Col span={18}>
            {" "}
            {/* Ensures child elements take full width of Content */}
            <Tabs
              defaultActiveKey="1"
              items={tabItems}
              style={{ marginBottom: "20px" }}
            />
            <Descriptions title="学生评语" bordered style={{ width: "100%" }}>
              <Descriptions.Item label="成绩评价">
                {evaluation && evaluation[0]
                  ? evaluation[0]
                  : "No evaluation available"}
              </Descriptions.Item>
              <Descriptions.Item label="稳定性评价">
                {evaluation && evaluation[1]
                  ? evaluation[1]
                  : "No evaluation available"}
              </Descriptions.Item>
              <Descriptions.Item label="消费评价">
                {evaluation && evaluation[2]
                  ? evaluation[2]
                  : "No evaluation available"}
              </Descriptions.Item>
            </Descriptions>
            {/* Add other content components here */}
            {/* </div> */}
            {renderEvaluation()}
          </Col>
          <Col span={6}>
            <Card title="User Labels" bordered={false}>
              {portraits.map((label, index) => (
                <Tag color="blue" key={index} style={{ margin: "4px" }}>
                  {label}
                </Tag>
              ))}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PersonalPortrait;
