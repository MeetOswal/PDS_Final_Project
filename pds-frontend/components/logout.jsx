import { useState } from "react";
import axios from "axios";

export function Logout({ logout }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get("http://127.0.0.1:5000/api/logout", {
        withCredentials: true,
      });

      logout(false);

    } catch (error) {
      console.log(error.response.data.error);
      
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button onClick={handleSubmit}>Logout</button>
    </>
  );
}
