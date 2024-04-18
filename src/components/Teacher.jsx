import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useUser } from "./UserContext";
import { Button, Radio } from "antd";

const CustomTooltip = ({ active, payload }) => {
  
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ddd",
        }}
      >
        <p>{`ID: ${data.snumber}`}</p>
        <p>{`PCA Feature 1: ${data.pca_1.toFixed(2)}`}</p>
        <p>{`PCA Feature 2: ${data.pca_2.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const GradeAnalysis = () => {
  const [viewMode, setViewMode] = useState("grades");
  const [stabilityData, setStabilityData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [clusterData, setClusterData] = useState([]);

  const goToClusterDetails = () => {
    if (viewMode === "grades") {
      navigate("/teacher_view/cluster");
    } else {
      navigate("/teacher_view/stable_cluster");
    }
  };
  const handleStudentClick = (student) => {
    if (viewMode === "grades") {
      
      navigate("/personal-portrait", { state: { snumber: student.snumber } });
    } else {
      navigate("/personal-portrait", { state: { snumber: student.snumber } });
    }
  };

  useEffect(() => {
    if (viewMode === "grades") {
    fetch(`http://localhost:8000/api/weight-grades`)
      .then((response) => response.json())
      .then((data) => {
        setClusterData(data.student_wgrades);
        console.log("ClusterData", data.student_wgrades);
      })
      .catch((error) => {
        console.error("Error fetching cluster data:", error);
        })
    } else if (viewMode === "stability") {
         fetch(`http://localhost:8000/api/cs-stable-data`)
        .then((response) => response.json())
        .then((data) => {
          setStabilityData(data.data); // 假设这是稳定性数据的格式
          console.log(data);
        })
        .catch((error) => console.error("Error fetching stability data:", error));
    }
  }, [viewMode]);

  const onFinish = (values) => {
      setIsLoggedIn(true);
      if (viewMode === "grades") {
      setUser({ snumber: values.snumber });
      console.log("Success:", values.snumber);
      } else{
        setUser({ snumber: values.snumber});
      }

    navigate("/personal-portrait");
  };
  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };
  // 定义每个聚类的颜色
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];
  const renderStabilityScatterChart = () => {
    return (
      <ResponsiveContainer width="70%" height={600}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey={"pca_1"} name={"PCA Feature 1"} />
          <YAxis type="number" dataKey={"pca_2"} name={"PCA Feature 2"} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {stabilityData &&
            Array.from(
              new Set(stabilityData.map((item) => item.stable_cluster))
            ).map((cluster, index) => (
              <Scatter
                key={cluster}
                name={`Cluster ${cluster}`}
                data={stabilityData.filter(
                  (item) => item.stable_cluster === cluster
                )}
                fill={colors[cluster % colors.length]} // 根据聚类标签选择颜色
                shape="circle" // 你可以改变形状
                lineType="joint"
                lineJointType="monotoneX"
                onClick={({ payload }) => handleStudentClick(payload)}
                onFinish={onFinish}
              />
            ))}
        </ScatterChart>
      </ResponsiveContainer>
    );
    
  };
  return (
    <>
      <Radio.Group
        value={viewMode}
        onChange={handleViewModeChange}
        style={{ marginBottom: 20 }}
      >
        <Radio.Button value="grades">成绩分数</Radio.Button>
        <Radio.Button value="stability">学习稳定性</Radio.Button>
      </Radio.Group>
      <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
        {viewMode === "grades" ? (
          <ResponsiveContainer width="70%" height={600}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey={"pca_1"} name={"PCA Feature 1"} />
              <YAxis type="number" dataKey={"pca_2"} name={"PCA Feature 2"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {clusterData &&
                Array.from(
                  new Set(clusterData.map((item) => item.grade_cluster))
                ).map((grade_cluster, index) => (
                  <Scatter
                    key={grade_cluster}
                    name={`Cluster ${grade_cluster}`}
                    data={clusterData.filter(
                      (item) => item.grade_cluster === grade_cluster
                    )}
                    fill={colors[grade_cluster % colors.length]} // 根据聚类标签选择颜色
                    shape="circle" // 你可以改变形状
                    lineType="joint"
                    lineJointType="monotoneX"
                    onClick={({ payload }) => handleStudentClick(payload)}
                    onFinish={onFinish}
                  />
                ))}
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          renderStabilityScatterChart() // 在这里调用渲染散点图的函数
        )}
        <Button onClick={goToClusterDetails} style={{ marginLeft: "20px" }}>
          Cluster details
        </Button>
      </div>
    </>
  );
};

export default GradeAnalysis;
