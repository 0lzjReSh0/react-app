import React, { useState, useEffect } from "react";
import { Layout, Card, Tabs, Typography, List, Tag, Descriptions } from "antd";
const { Title, Text } = Typography;
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
import { useUser } from "./UserContext";

const { Content } = Layout;

const PersonalPortrait = () => {
  
  const [retakeInfo, setRetakeInfo] = useState({});
  const [studentGrades, setStudentGrades] = useState([]);
  const [stats, setStats] = useState({});
  const [cluster, setCluster] = useState(null);
  const [evaluation, setEvaluation] = useState("");
  const { user } = useUser();
  const [protrait, setProtrait] = useState([]);

  useEffect(() => {
    console.log(user);
    if (user && user.snumber) {
      fetch(`http://localhost:8000/api/student-profile/${user.snumber}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setProtrait(data);
          const student_grades = data || {};
          const chartData = Object.keys(student_grades)
            .filter((key) => key.includes("_grade") && !key.includes("_retake"))
            .map((key) => ({
              subject: key.replace("_grade", ""),
              score: student_grades[key],
            }));

          setStudentGrades(chartData);
          setStats(data.stats || {});

          // 设置补考信息
          const retakeData = {
            g1965b2825_retake: student_grades.g1965b2825_retake,
            g1968c2825_retake: student_grades.g1968c2825_retake,
          };
          setRetakeInfo(retakeData);

          // 设置聚类信息
          setCluster(student_grades.cluster);
          const classAverage =
            Object.values(data.stats.avg).reduce((acc, cur) => acc + cur, 0) /
            Object.values(data.stats.avg).length;

          const studentAverage =
            data.grade_avg

          let evalText = data.commentary;
          console.log(classAverage);
          // if (studentAverage > classAverage) {
          //   evalText = "成绩高于全体学生平均分，请继续保持！";
          // } else if (studentAverage < classAverage) {
          //   evalText = "成绩低于全体学生平均分，请加把劲！";
          // }
          setEvaluation(evalText);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [user]);

  // const calculateStrengthsAndWeaknesses = () => {
  //   const strengths = [];
  //   const weaknesses = [];
  //   studentGrades.forEach((grade) => {
  //     if (grade.score > stats.avg[`${grade.subject}_grade__avg`]) {
  //       strengths.push(grade.subject);
  //     } else if (grade.score < stats.avg[`${grade.subject}_grade__avg`]) {
  //       weaknesses.push(grade.subject);
  //     }
  //   });
  //   return { strengths, weaknesses };
  // };
  const radarData = studentGrades.map((grade) => ({
    subject: grade.subject,
    score: grade.score,
    average: stats.avg ? stats.avg[`${grade.subject}_grade__avg`] || 0 : 0,
  }));

  const strengthsData = radarData.filter((data) => data.score > data.average);
  const weaknessesData = radarData.filter((data) => data.score < data.average);
  
  // const { strengths, weaknesses } = calculateStrengthsAndWeaknesses();
  const renderEvaluation = () => (
    <Descriptions title="学生评语" bordered column={1} size="small">
      <Descriptions.Item label="平均成绩">
        {protrait.grade_avg}
      </Descriptions.Item>
      <Descriptions.Item label="优势课程">
        {strengthsData.map((data) => data.subject).join(", ")}
      </Descriptions.Item>
      <Descriptions.Item label="劣势课程">
        {weaknessesData.map((data) => data.subject).join(", ")}
      </Descriptions.Item>
      {/* <Descriptions.Item label="成绩评价">{evaluation}</Descriptions.Item> */}
      <Descriptions.Item label="成绩稳定性">
        {protrait.grade_std}
      </Descriptions.Item>
      <Descriptions.Item label="成绩波动范围">
        {protrait.grade_range}
      </Descriptions.Item>
      <Descriptions.Item label="是否有挂科">
        {Object.values(retakeInfo).some((value) => value === 1) ? "是" : "否"}
      </Descriptions.Item>
    </Descriptions>
  );
    
  const renderRetakeInfo = () => (
    <div>
      <Title level={4}>retake infomation</Title>
      {Object.values(retakeInfo).some((value) => value === 1) ? (
        <List
          bordered
          dataSource={Object.entries(retakeInfo)}
          renderItem={([key, value]) =>
            value === 1 && (
              <List.Item>
                <Text>{key.replace("_retake", "")}: </Text>
                <Tag color="volcano">have retaked</Tag>
              </List.Item>
            )
          }
        />
      ) : (
        <Text style={{ fontSize: "16px", color: "green" }}>no failed course record</Text>
      )}

    </div>
  );

  

  const renderContent = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 24,
        }}
      >
        <div style={{ flex: 1 }}>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>

        <Descriptions
          title="grade evaluation"
          style={{ marginTop: 20, marginLeft: "100px" }}
        >
          <Descriptions.Item label="评价">{evaluation[0]}</Descriptions.Item>
        </Descriptions>
      </div>
      <div>
        <Descriptions title="stability evaluation" style={{ marginTop: 20 }}>
          <Descriptions.Item label="评价">{evaluation[1]}</Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
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

  const tabItems = [
    {
      label: "全部成绩",
      key: "1",
      children: (
        <>
          <Card>
            <BarChart width={730} height={250} data={studentGrades}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </Card>
          
        </>
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
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content
          style={{
            width: "1400px",
            display: "flex",
            padding: "20px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            {renderContent()}
            <div style={{ marginLeft: "24px", minWidth: "300px" }}>
              {renderEvaluation()}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PersonalPortrait;
