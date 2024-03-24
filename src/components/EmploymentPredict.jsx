// components/EmploymentPredict.jsx
import React, { useState, useEffect } from "react";
// Assume your CSS styles are here

const EmploymentPredict = () => {
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    // TODO: Fetch prediction from backend and set state
    // setPrediction(fetchedPrediction);
  }, []);

  return (
    <div className="employment-predict">
      <h2>Employment Prediction</h2>
      {/* Display the prediction */}
      <p>{prediction}</p>
    </div>
  );
};

export default EmploymentPredict;
