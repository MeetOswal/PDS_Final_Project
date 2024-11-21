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

  const getUser = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/profile", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
        if(error.response && error.response.data) {
          return error.response.data;
        }
        else {
          setError("Server Not Found");
          return {"error": ""}
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
    return <div>Server Not Found</div>
  }

  return (
    <>
      <div>Welcome, {unescapeHTML(userData)}</div>
      <div>
        {!loggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <Logout logout={logoutfunction} />
        )}
      </div>
      {
        loggedIn && (
          <>
          <Link to = "/profile">My Profile</Link>
          <br />
          <Link to="/get-item">Get Item</Link>
          <br />
          <Link to="/order-details">Order-Details</Link>
          <br />
          <Link to="/order-history">Your Order-History</Link>
          <br />
          <Link to = "/categories">Categories</Link>
          <br />
          <Link to = "/volunteer-task">Volunteer Tasks</Link>
          <br />
          <Link to = "/supervision-task">Supervision Tasks</Link>
          <br />
          <Link to = "/donate">New Donation</Link>
          <br />
          <Link to = "/order">New Order</Link>
          </>
          
        )
      }

    </>
  );
}

export default App;
