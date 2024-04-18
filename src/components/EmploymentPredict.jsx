import React, { useState, useEffect,useRef } from "react";
import { Pie } from "@antv/g2plot";
import { Spin } from "antd";
import { useSelector } from "react-redux";

const EmploymentPredict = () => {
  const pieChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const loggedInUser = useSelector((state) => state.user.user);
  const studentNumber = loggedInUser.snumber;
  const [bestCategory, setBestCategory] = useState("");
  const [topGrade, setTopGrade] = useState("");
  const [employmentSuggestion, setEmploymentSuggestion] = useState("");


  useEffect(() => {
    fetch(`http://localhost:8000/api/employment-predict/${studentNumber}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBestCategory(data[0].top_course_cname)
        setTopGrade(data[0].top_course_grade)
        // 假设后端返回的是一个数组，我们取第一个元素
        const chartData = [
          {
            type: "Data Analysis",
            value: Number(data[0].data_analysis_avg_grade) || 0,
          },
          {
            type: "Development",
            value: Number(data[0].development_avg_grade) || 0,
          },
          {
            type: "Administration",
            value: Number(data[0].administration_avg_grade) || 0,
          },
        ];

        // 渲染饼图
        const highestCategory = chartData.reduce(
          (acc, item) => {
            return acc.value > item.value ? acc : item;
          },
          { type: "", value: -Infinity }
        );
        setBestCategory(highestCategory.type);
        switch (highestCategory.type) {
          case "Data Analysis":
            setEmploymentSuggestion(data[0].top_course_cname);
            break;
          case "Development":
            setEmploymentSuggestion(data[0].top_course_cname);
            break;
          case "Administration":
            setEmploymentSuggestion(data[0].top_course_cname);
            break;
          default:
            setEmploymentSuggestion(data[0].top_course_cname);
            break;
        }

        if (pieChartRef.current) {
          // Update data for existing chart
          pieChartRef.current.changeData(chartData);
        } else {
          // Create new chart
          const pieChart = new Pie("employment-predict-chart", {
            appendPadding: 10,
            data: chartData,
            angleField: "value",
            colorField: "type",
            radius: 1,
            innerRadius: 0.6,
            label: {
              type: "inner",
              offset: "-50%",
              content: ({ value }) => `${value.toFixed(2)}`,
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
          pieChartRef.current = pieChart; // Store chart instance in ref
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employment prediction data:", error);
        setLoading(false);
      });

    // Cleanup function to destroy chart
    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
        pieChartRef.current = null;
      }
    };
  }, [studentNumber]);

  return (
    <div className="employment-predict">
      <h2>Employment Prediction</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
        <div id="employment-predict-chart" style={{ height: 400 }}></div>
        <div style={{ marginTop: 20 }}>
          <h3>Best Performing Category: {bestCategory}</h3>
          <p>The student's best performance is in {bestCategory}. Consider positions such as {employmentSuggestion}.</p>
        </div>
        </div>
      )}
    </div>
  );
};

export default EmploymentPredict;
