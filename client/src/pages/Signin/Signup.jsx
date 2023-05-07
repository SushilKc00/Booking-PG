import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signin.css";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  let [address, setAddress] = useState("");
  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    let navLocation = () => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });
    };
    let latlong = await navLocation().then((res) => {
      let latitude = res.coords.latitude;
      let longitude = res.coords.longitude;
      return [latitude, longitude];
    });
    // console.log(latlong)
    let [lat, long] = latlong;
    console.log(lat, long);
    const response = await fetch("/api/auth/getlocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latlong: { lat, long } }),
    });
    const { location } = await response.json();
    console.log(location);
    setAddress(location);
    setCredentials({ ...credentials, [e.target.name]: location });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
      // credentials: 'include',
      // Origin:"http://localhost:3000/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //save the auth toke to local storage and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/login");
    } else {
      alert("Enter Valid Credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div></div>

      <div className="main">
        <div className="sub-main">
          <form onSubmit={handleSubmit}>
            <h1>Register Page</h1>

            <label htmlFor="name" className="form-label">
              Name
            </label>
            <div>
              <input
                type="text"
                className="inputs"
                name="name"
                value={credentials.name}
                onChange={onChange}
                aria-describedby="emailHelp"
              />
            </div>

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

            <label htmlFor="address" className="form-label">
              Address
            </label>
            <div>
              <input
                type="text"
                className="inputs"
                name="address"
                placeholder='"Click below for fetching address"'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-describedby="emailHelp"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleClick}
                name="geolocation"
                className=" btn btn-success"
              >
                Click for current Location{" "}
              </button>
            </div>

            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <div className="second-input">
              <input
                type="password"
                className="inputs"
                value={credentials.password}
                onChange={onChange}
                name="password"
              />

              <div className="login-buttons">
                <button type="submit" className="buttons">
                  Submit
                </button>
              </div>

              <p className="links">
                <Link to="/login" className="m-3 mx-1 btn btn-danger">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
