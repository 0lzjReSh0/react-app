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
import { Button } from "antd";

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

const Routine = () => {
  const [clusterData, setClusterData] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/api/cs-routine`)
        .then((response) => response.json())
        .then((data) => {
          setClusterData(data.data);
          console.log("ClusterData", data);
        })
        .catch((error) => {
          console.error("Error fetching cluster data:", error);
        });
    }
  }, [user]);

  const handleStudentClick = (student) => {
    navigate("/personal-portrait", { state: { snumber: student.snumber } });
  };
  const colors = ["#8884d8", "#82ca9d", "#ffc658"];
  const goToClusterDetails = () => {
    navigate("/teacher_view/routine_cluster");
  };
  // Assuming clusterData is in the format you specified at the beginning of your question
  const renderScatterChart = (data) => (
    <div>
      <ResponsiveContainer width="70%" height={600}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey={"pca_1"} name={"PCA Feature 1"} />
          <YAxis type="number" dataKey={"pca_2"} name={"PCA Feature 2"} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {clusterData &&
            Array.from(new Set(clusterData.map((item) => item.cluster))).map(
              (cluster, index) => (
                <Scatter
                  key={cluster}
                  name={`Cluster ${cluster}`}
                  data={clusterData.filter((item) => item.cluster === cluster)}
                  fill={colors[cluster % colors.length]} // 根据聚类标签选择颜色
                  shape="circle" // 你可以改变形状
                  lineType="joint"
                  lineJointType="monotoneX"
                  onClick={({ payload }) => handleStudentClick(payload)}
                />
              )
            )}
        </ScatterChart>
      </ResponsiveContainer>
      <Button onClick={goToClusterDetails} style={{ marginLeft: "20px" }}>
        CLuster analysis
      </Button>
    </div>
  );

  return <div>{renderScatterChart(clusterData)}</div>;
};

export default Routine;
