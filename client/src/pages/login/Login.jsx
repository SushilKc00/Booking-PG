import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      // credentials: 'include',
      // Origin:"http://localhost:3000/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth toke to local storage and redirect
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("token", json.authToken);
      navigate("/");
    } else {
      alert("Enter Valid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div>
        <div className="main">
          <div className="sub-main">
            <form onSubmit={handleSubmit}>
              <div>
                <h1>Login Page</h1>
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <div>
                  <input
                    className="inputs"
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                    aria-describedby="emailHelp"
                  />
                </div>
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <div className="second-input">
                  <input
                    className="inputs"
                    type="password"
                    value={credentials.password}
                    onChange={onChange}
                    name="password"
                  />{" "}
                </div>
                <div className="login-buttons">
                  <button type="submit" className="buttons">
                    Submit
                  </button>
                </div>

                <p className="links">
                  <Link to="/register" className="m-3 mx-1 btn btn-danger">
                    New User
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
