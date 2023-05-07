import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handlelogin =()=>{
    navigate("/login")
  }
  const handleSignup =()=>{
    navigate("/register")
  }

  const handleBook =()=>{
    navigate("/mybookings")
  }
  const handleLogout =()=>{
    localStorage.removeItem('token')
    navigate("/")

    
  }

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">PG Life</span>
        </Link>
        {(!localStorage.getItem("token")) ? (
          <div className="navItems">
            <button className="btn" onClick={handleSignup}>Register</button>
            <button className="btn" onClick={handlelogin}>Login</button>
          </div>
        )
     :(
      <div>
      
      <button className="btn " onClick={handleLogout}>Logout</button> 
      </div>
      )}
      </div>
    </div>
  );
};


export default Navbar;
