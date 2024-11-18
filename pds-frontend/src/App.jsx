import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Logout } from "../components/logout";
const getUser = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/profile", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <div>Welcome, {userData}</div>
      <div>
        {!loggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <Logout logout={logoutfunction} />
        )}
      </div>
    </>
  );
}

export default App;
