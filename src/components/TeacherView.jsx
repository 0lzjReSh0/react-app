// TeacherView.jsx
import React from "react";
import { Link } from "react-router-dom";

const TeacherView = () => {
  return (
    <div>
      <h2>学生群像</h2>
      <ul>
        <li>
          <Link to="/teacher_view/grade_analysis">成绩分析</Link>
        </li>
        <li>
          <Link to="/teacher_view/consumption_analysis">消费分析</Link>
        </li>
      </ul>
    </div>
  );
};

export default TeacherView;
