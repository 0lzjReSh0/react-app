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
import { log } from "@antv/g2plot/lib/utils";

const { Content } = Layout;

const Cluster = () => {
  const [retakeInfo, setRetakeInfo] = useState({});
  const [clusterAverages, setClusterAverages] = useState({});
  const [stats, setStats] = useState({});
  const { user } = useUser();
  const [evaluation, setEvaluation] = useState({});

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/api/weight-grades`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const clusterAverages = calculateClusterAverages(
            data.student_wgrades,
            data.stats.avg
          );
          setStats(data.stats || {});
          
          setEvaluation(data.stats.conmmentary || "");
          setClusterAverages(clusterAverages);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    
  }, [user]);
  console.log(clusterAverages);
  console.log(evaluation);
  const renderComments = () => {
    return Object.keys(evaluation).map((key) => (
      <Descriptions.Item key={key} label={`评价 ${key}`}>
        {evaluation[key]}
      </Descriptions.Item>
    ));
  };
  const calculateClusterAverages = (studentWgrades, avgStats) => {
    let clusterData = { cluster0: [], cluster1: [], cluster2: [] };

    studentWgrades.forEach((student) => {
      const grade_cluster = `cluster${student.grade_cluster}`;
      if (clusterData[grade_cluster]) {
        clusterData[grade_cluster].push(student);
      }
    });

    let clusterAverages = {};
    Object.keys(clusterData).forEach((cluster) => {
      clusterAverages[cluster] = clusterData[cluster].reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
          if (key.includes("_wgrade")) {
            acc[key] = (acc[key] || 0) + curr[key];
          }
        });
        return acc;
      }, {});

      Object.keys(clusterAverages[cluster]).forEach((key) => {
        clusterAverages[cluster][key] /= clusterData[cluster].length;
      });

      // Converting to the required format for radar chart
      clusterAverages[cluster] = Object.keys(clusterAverages[cluster]).map(
        (key) => ({
          subject: key.replace("_wgrade", ""),
          clusterAverage: clusterAverages[cluster][key],
          average: avgStats ? avgStats[`${key}__avg`] || 0 : 0,
        })
      );
    });

    return clusterAverages;
  };

  const renderRadarChart = (title, data, clusterData) => (
    <Card title={title}>
      <RadarChart outerRadius={90} width={930} height={300} data={clusterData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Cluster Average"
          dataKey="clusterAverage"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.8}
        />
        <Radar
          name="Overall Average"
          dataKey="average"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.5}
        />
        {/* Highlight differences by adding a line or area */}
        
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
      </RadarChart>
    </Card>
  );

  // Tab Items with updated RadarChart calls
  const tabItems = [
    {
      label: "Cluster 0",
      key: "1",
      children: renderRadarChart(
        "Cluster 0",
        stats,
        clusterAverages.cluster0 || []
      ),
    },
    {
      label: "Cluster 1",
      key: "2",
      children: renderRadarChart(
        "Cluster 1",
        stats,
        clusterAverages.cluster1 || []
      ),
    },
    {
      label: "Cluster 2",
      key: "3",
      children: renderRadarChart(
        "Cluster 2",
        stats,
        clusterAverages.cluster2 || []
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content style={{ width: "1200px", padding: "20px", marginTop: 30 }}>
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <Tabs defaultActiveKey="1" items={tabItems} />
            <Descriptions title="学生评语" style={{ marginTop: 20 }}>
              {renderComments()}
            </Descriptions>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Cluster;
