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

const StableCluster = () => {
  const [retakeInfo, setRetakeInfo] = useState({});
  const [clusterAverages, setClusterAverages] = useState({});
  const [stats, setStats] = useState({});
  const { user } = useUser();
  const [evaluation, setEvaluation] = useState("");

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/api/cs-stable-data`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
          const clusterAverages = calculateClusterAverages(
            data.data,
            data.stats.avg
          );
          setStats(data.stats || {});
          
          setEvaluation(data.commentary);
          setClusterAverages(clusterAverages);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    
  }, [user]);

  const calculateClusterAverages = (studentWgrades, avgStats) => {
    let clusterData = { cluster0: [], cluster1: [], cluster2: [] };

    studentWgrades.forEach((student) => {
      const stablecluster = `cluster${student.stablecluster}`;
      if (clusterData[stablecluster]) {
        clusterData[stablecluster].push(student);
      }
    });

    let clusterAverages = {};
    Object.keys(clusterData).forEach((stablecluster) => {
      clusterAverages[stablecluster] = clusterData[stablecluster].reduce(
        (acc, curr) => {
          Object.keys(curr).forEach((key) => {
            if (key.includes("grade_")) {
              acc[key] = (acc[key] || 0) + curr[key];
            }
          });
          return acc;
        },
        {}
      );

      Object.keys(clusterAverages[stablecluster]).forEach((key) => {
        clusterAverages[stablecluster][key] /=
          clusterData[stablecluster].length;
      });

      // Converting to the required format for radar chart
      clusterAverages[stablecluster] = Object.keys(
        clusterAverages[stablecluster]
      ).map((key) => ({
        subject: key,
        clusterAverage: clusterAverages[stablecluster][key],
        average: avgStats ? avgStats[`${key}__avg`] || 0 : 0,
      }));
    });

    return clusterAverages;
  };
  console.log(stats.avg);
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
        "stablecluster 0",
        stats,
        clusterAverages.cluster0 || []
      ),
    },
    {
      label: "Cluster 1",
      key: "2",
      children: renderRadarChart(
        "stablecluster 1",
        stats,
        clusterAverages.cluster1 || []
      ),
    },
    {
      label: "Cluster 2",
      key: "3",
      children: renderRadarChart(
        "stablecluster 2",
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
              <Descriptions.Item label="评价">{evaluation}</Descriptions.Item>
            </Descriptions>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StableCluster;
