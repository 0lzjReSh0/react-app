// Login.js
import React, { useState } from "react";
import { useUser } from "./UserContext";

const Login = () => {
  const [snumber, setSnumber] = useState("");
  const { setUser } = useUser();

  const handleLogin = () => {
    setUser({ snumber }); // Update the context with the student number
  };

  return (
    <div>
      <input
        type="text"
        value={snumber}
        onChange={(e) => setSnumber(e.target.value)}
        placeholder="Enter student number"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
