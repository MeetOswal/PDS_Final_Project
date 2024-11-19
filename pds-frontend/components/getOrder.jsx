import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function GetOrder() {
  const [orderID, setorderID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [orderClient, setOrderClient] = useState(null);
  const [orderDate, setorderDate] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const checkOrderID = (itemID) => {
    const itemRegex = /^\d+$/;
    return itemRegex.test(itemID);
  };

  const handleClick = async () => {
    let isvalid = checkOrderID(orderID);

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
      } catch (error) {
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("Invalid Order Id");
    }
  };

  return (
    <>
      <Link to="/">Home</Link>

      <div>
        <label htmlFor="order"></label>
        <input
          type="text"
          value={orderID}
          placeholder="Enter OrderID"
          onChange={(e) => setorderID(e.target.value)}
        />
        <button onClick={handleClick}>
          {loading ? "Loading..." : "Get Item"}
        </button>
      </div>

      {error && <div>{error}</div>}

      {orderClient && orderDate && (
        <div>
          <div>Order ID : {orderID}</div>
          <div>Client : {orderClient}</div>
          <div>Order Date : {orderDate}</div>
          <br />
          <div>Items:</div>
          {orderItems.map((item) => {
            return (
              <div key={item.ItemID}>
                <div>Item ID : {item.ItemID}</div>
                <div>Item Description: {item.iDescription}</div>
                <br />
                {item.piece.map((pie) => {
                  return (
                    <div key={pie.pieceNum}>
                      <div>Piece Number: {pie.pieceNum}</div>
                      <div>Piece Description: {pie.pDescription}</div>
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
