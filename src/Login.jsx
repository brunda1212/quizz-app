import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import Cookies from "js-cookie";

import "./index.css";

const Login= () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  
  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });

    navigate("/", { replace: true });
  };
  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
  };


  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
      <div className="login-form-container flex justify-center items-center min-h-screen bg-[url('https://img.freepik.com/premium-vector/geometric-gradient-technology-background_23-2149110132.jpg')] bg-cover bg-center">
    <div className="w-full max-w-sm bg-white/70   rounded-2xl shadow-xl p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Login
      </h1>
      <form className="p-3 m-2 space-y-4" onSubmit={submitForm}>
        
        <div className="input-container p-2">
          <label className="input-label" placeholder="Enter Username" htmlFor="username">
        USERNAME
      </label><br/>
      <input
        type="text"
        id="username"
        className="username-input-field border border-gray rounded p-2"
        value={username}
        onChange={onChangeUsername} 
        placeholder="Username"
      />
        </div>

        <div className="input-container p-2">
        <label className="input-label " placeholder="Enter Password" htmlFor="password"> 
        PASSWORD
      </label><br/>
      <input
        type="password"
        id="password"
        className="password-input-field border border-gray rounded p-2"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>

        {showSubmitError && (
          <p className="text-red-500 text-sm mt-2 text-center">
            *{errorMsg}
          </p>
        )}
      </form>
    </div>
  </div>
  );
};

export default Login