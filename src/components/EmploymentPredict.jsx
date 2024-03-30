import React, { useState, useEffect } from "react";
import { Pie } from "@antv/g2plot";
import { Spin } from "antd";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const EmploymentPredict = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const loggedInUser = useSelector((state) => state.user.user);
  const location = useLocation(); // 使用 useLocation 获取路由状态
  const studentNumber = location.state?.snumber || loggedInUser.snumber; 
  useEffect(() => {
    fetch(`http://localhost:8000/api/employment-predict/${studentNumber}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0].administration_avg_grade);
        setData([
          {
            type: "Data Analysis",
            value: data[0].data_analysis_avg_grade,
          },
          {
            type: "Development",
            value: data[0].development_avg_grade,
          },
          {
            type: "Administration",
            value: data[0].administration_avg_grade,
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching employment prediction data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    if (data) {
      // 创建饼图
      const pieChart = new Pie("employment-predict-chart", {
        appendPadding: 10,
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: "inner",
          offset: "-50%",
          content: "{value}",
          style: {
            textAlign: "center",
            fontSize: 14,
          },
        },
        interactions: [
          { type: "element-selected" },
          { type: "element-active" },
        ],
      });

      pieChart.render();
    }
    // }, [data]);
  }, []);

  // useEffect(() => {
    

  return (
    <div className="employment-predict">
      <h2>Employment Prediction</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div id="employment-predict-chart" style={{ height: 400 }}></div>
      )}
    </div>
  );
};

export default EmploymentPredict;
