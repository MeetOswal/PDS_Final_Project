import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { unescapeHTML } from "./utils";
export function Filter() {
  const { state } = useLocation();
  const [fetchResponse, setFetchResponse] = useState(null);
  const [error, setError] = useState(null);
  const [removeBought, setRemoveBought] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchItems = async (formData) => {
      try {
        const response = await axios.post(
          `http://127.0.0.1:5000/api/category`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        setFetchResponse(response.data);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          nav("/");
        }
      }finally {
        setLoading(false);
      }
    };

    if (state) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(state));
      fetchItems(formData);
    } else {
      const formData = new FormData();
      formData.append("data", JSON.stringify({}));
      fetchItems(formData);
    }
  }, [state]);

  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <div>
      <Link to="/">Home</Link>
      <br />
      <Link to="/categories">Select Categories</Link>
      <h3>Items</h3>
      
      {error && <div>{error}</div>}
      {fetchResponse && (
        <button onClick={() => setRemoveBought((currentState) => !currentState)}>
        Remove Bought Items
      </button>
      )}
      {fetchResponse &&
        fetchResponse.map((item) =>
          removeBought ? (
            item.found !== 1 && (
              <div key={item.ItemID}>
                <div>Item Description : {unescapeHTML(item.iDescription)}</div>
                <div><a onClick={() => nav("/get-item", {state :item.ItemID})}>Get More Info..</a></div>
                <div> <img src={`data:image/jpeg;base64,${item.photo}`} /></div> 
                <br />
              </div>
            )
          ) : (
            <div key={item.ItemID}>
              {item.found == 1 && <div>Bought</div>}
              <div>Item Description : {unescapeHTML(item.iDescription)}</div>
              <div><a onClick={() => nav("/get-item", {state :item.ItemID})}>Get More Info..</a></div>
              <div><img src={`data:image/jpeg;base64,${item.photo}`} /></div>
              
              <br />
            </div>
          )
        )}
    </div>
  );
}
