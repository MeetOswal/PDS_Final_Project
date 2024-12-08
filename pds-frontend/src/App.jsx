import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Logout } from "../components/logout";
import validator from "validator";

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [permission, setPermission] = useState(false);

  const getUser = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/profile", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        setError("Server Not Found");
        return { error: "" };
      }
    }
  };

  const checkStaff = async () => {
    try {
      await axios.get(`http://127.0.0.1:5000/api/check/staff`, {
        withCredentials: true,
      });
      setPermission(true);
    } catch (error) {
      if (error.response) {
        setPermission(false);
      }
    }
  };

  const logoutfunction = (logout) => {
    setLoggedIn(logout);
    setUserData("User");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const result = await getUser();

      if (result.error) {
        setUserData("User");
        setLoggedIn(false);
      } else {
        setUserData(result.fname);
        setLoggedIn(true);
        await checkStaff();
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const unescapeHTML = (input) => {
    return validator.unescape(input); // Unescape HTML entities like &lt; -> <
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Server Not Found</div>;
  }

  return (
    <div className="app-container">
      {!loggedIn ? (
        <div className="welcome-container">
          <div className="welcome-message">Welcome, {unescapeHTML(userData)}</div>
          <div className="centered-button">
            <Link to="/login" className="auth-button">Login</Link>
          </div>
        </div>
      ) : (
        <div className="logged-in-layout">
          <div className="top-bar">
            <div className="welcome-message">Welcome, {unescapeHTML(userData)}</div>
            <div className="logout-button">
              <Logout logout={logoutfunction} />
            </div>
          </div>
          <div className="menu">
            <Link to="/profile">My Profile</Link>
            <br />
            <Link to="/get-item">Get Item</Link>
            <br />
            <Link to="/order-details">Order Details</Link>
            <br />
            <Link to="/order-history">Your Order History</Link>
            <br />
            <Link to="/categories">Categories</Link>
            <br />
            {permission && <Link to="/donate">New Donation</Link>}
            <br />
            {permission && <Link to="/order">New Order</Link>}
            <br />
            {permission && <Link to="/ranking">Volunteer Ranking</Link>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;