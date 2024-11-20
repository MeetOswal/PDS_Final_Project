import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function OrderHistory() {
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const orderHistory = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/api/orderhistory",
          {
            withCredentials: true,
          }
        );

        setClient(response.data.client);
        setOrders(response.data.orders);

      } catch (error) {
        if (error.response && error.response.data.error == 'User not logined'){
            nav("/login")
        }
        else if (error.response){
            setError(error.response.data.error)
        }
        else{
            nav("/")
        }
            
      }finally{
        setLoading(false)
      }
    };
    orderHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <>
        <Link to = "/">Home</Link>
      <h3>Order History</h3>
      {client ? (
        <>
          <div>User: {client}</div>
          ***************************
          <br />
          {orders.map((order) => {
            return (
              <div key={order.orderId}>
                <div>Order Id: {order.orderId}</div>
                <div>Order Date: {order.orderDate}</div>
                <br />
                {order.items.map((item) => {
                  return (
                    <div key={item.ItemID}>
                      <div>ItemID : {item.ItemID}</div>
                      <div>Item Description : {item.iDescription}</div>
                      <br />
                    </div>
                  );
                })}
                ***************************
              </div>
            );
          })}
        </>
      ) : (
      <div>{error}</div>
        )}
    </>
  );
}
