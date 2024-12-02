import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { unescapeHTML } from "./utils";
export function Filter() {
  const { state } = useLocation();
  const [fetchResponse, setFetchResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [page, setPage] = useState(1)
  const nav = useNavigate();

  useEffect(() => {
    const fetchItems = async (formData) => {
      try {
        const response = await axios.post(
          `http://127.0.0.1:5000/api/category/${page}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        setFetchResponse(response.data.result);
        response.data.next === 1 ? setNext(true) : setNext(false)
        response.data.prev === 1 ? setPrev(true) : setPrev(false)

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
  }, [state, page]);

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
      {fetchResponse &&
        fetchResponse.map((item) =>
          (
            <div key={item.ItemID}>
              <div>Item Description : {unescapeHTML(item.iDescription)}</div>
              <div><img src={`data:image/jpeg;base64,${item.photo}`} /></div>
              <div><a onClick={() => nav("/get-item", {state :item.ItemID})}>Get More Info..</a></div>
              <br />
            </div>
          )
        )}
        { prev && (
          <button onClick={() => setPage(currentPage => currentPage - 1)}>Prev</button>
          )
        }
        {next && (
          <button onClick={() => setPage(currentPage => currentPage + 1)}>Next</button>
        )}
    </div>
  );
}
