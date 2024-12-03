import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { unescapeHTML } from "./utils";

export function GetOrder() {
  const [updatePermission, setUpdatePermission] = useState(false);
  const [doUpdate, setDoUpdate] = useState(false);
  const [orderID, setorderID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [orderClient, setOrderClient] = useState(null);
  const [orderDate, setorderDate] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [orderDelivery, setOrderDelivery] = useState({
    deliverdBy: "",
    date: "",
    status: "",
  });

  const { state } = useLocation();
  const nav = useNavigate();
  const [suerpvisor, setSupervisor] = useState(null);

  const checkOrderID = (itemID) => {
    const itemRegex = /^\d+$/;
    return itemRegex.test(itemID);
  };

  const handleClick = async () => {
    let isvalid = checkOrderID(orderID);
    setOrderDelivery({
      deliverdBy: "",
      date: "",
      status: "",
    });
    setSupervisor(null);
    setLoading(true);
    setOrderClient(null);
    setorderDate(null);
    setOrderItems(null);
    setError(null);

    if (isvalid) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/order/${orderID}`,
          {
            withCredentials: true,
          }
        );
        setOrderClient(response.data.client);
        setorderDate(response.data.orderDate);
        setOrderItems(response.data.item);
        setOrderDelivery((curretState) => ({
          ...curretState,
          deliverdBy: response.data.delivery_partner,
          date: response.data.delivery_date,
          status: response.data.status,
        }));
        setSupervisor(response.data.supervisor);
      } catch (error) {
        console.log(error);
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("Invalid Order Id");
    }
  };

  useEffect(() => {
    if (state) {
      const orderID = state.toString();
      setorderID(orderID);
    }

    const checkUser = async () => {
      try {
        await axios.get(`http://127.0.0.1:5000/api/check/user`, {
          withCredentials: true,
        });
        setUpdatePermission(true);
      } catch (error) {
        error.response ? setUpdatePermission(false) : nav("/");
      }
    };
    checkUser();
  }, [state]);

  useEffect(() => {
    if (state) {
      const handleClickAsync = async () => {
        await handleClick();
      };
      handleClickAsync();
    }
  }, [orderID]);

  const handleUpdate = async(event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("stauts", orderDelivery.status);
      formData.append("orderID", orderID);
      const response = await axios.post(
        "http://127.0.0.1:5000/api/status-update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
        console.log(response);
        setDoUpdate(false)
    } catch (error) {
      console.log(error);
        error.response ? setError(error.response.data.error) : nav("/")
    }
  }

  return (
    <>
      {!state ? (
        <Link to="/">Home</Link>
      ) : (
        <Link onClick={() => nav(-1)}>Back</Link>
      )}

      <div>
        <label htmlFor="order"></label>
        <input
          type="text"
          value={orderID}
          placeholder="Enter OrderID"
          onChange={(e) => setorderID(e.target.value)}
          disabled={!!state}
        />
        <button onClick={handleClick} disabled={!!state}>
          {loading ? "Loading..." : "Get Item"}
        </button>
      </div>

      {error && <div>{error}</div>}
      <br />
      {orderClient && orderDate && (
        <div>
          <div>Client : {unescapeHTML(orderClient)}</div>
          <div>Order Date : {orderDate}</div>
          <div>Supervisor: {suerpvisor}</div>
          <div>Delivery Partner: {orderDelivery.deliverdBy}</div>
          <div>Delivery Date: {orderDelivery.date}</div>
            { doUpdate ? (
            <div>
              <span>Delivery Status: </span>
              <input type="text" 
              value={orderDelivery.status}
              onChange={(e) => setOrderDelivery((state) => ({...state, status : e.target.value}))}
              />
              <button onClick={(e) => handleUpdate(e)}>Update</button>
            </div>
            ) : (
            <div> 
              <span>Delivery Status: {orderDelivery.status} </span>
              {updatePermission && (
                <button onClick={(e) => setDoUpdate(state => !state)}>Update</button>
              )}
            </div>
            )
            }
          <br />
          <div>Items:</div>
          {orderItems.map((item) => {
            return (
              <div key={item.ItemID}>
                <div>Item ID : {item.ItemID}</div>
                <div>Item Description: {unescapeHTML(item.iDescription)}</div>
                <br />
                {item.piece.map((pie) => {
                  return (
                    <div key={pie.pieceNum}>
                      <div>Piece Number: {pie.pieceNum}</div>
                      <div>Piece Description: {unescapeHTML(pie.pDescription)}</div>
                      <div>Piece Location:</div>
                      <div>Room Number: {pie.roomNum}</div>
                      <div>Shelf Number: {pie.shelfNum}</div>
                      <br />
                    </div>
                  );
                })}
                **************************************
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
