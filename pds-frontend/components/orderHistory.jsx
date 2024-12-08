import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { unescapeHTML } from "./utils";
export function OrderHistory() {
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(['Client', 'Supervisor', 'Delivery'])
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

  const roleFilter = (value) => {
    setFilter(currentState => (currentState.includes(value) ? currentState.filter(val => val !== value) : [...currentState, value]))
  }

  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <>
        <Link to = "/">Home</Link>
      <h3>Order History</h3>
      {client && (
        <>
        <input type="checkbox"
        onChange={(e) => roleFilter('Client')}
        checked= {filter.includes('Client')}
         />
        <label htmlFor="Client">Client</label>

        <input type="checkbox"
        onChange={(e) => roleFilter('Supervisor')}
        checked= {filter.includes('Supervisor')}
         />
        <label htmlFor="Supervisor">Supervisor</label>

        <input type="checkbox"
        onChange={(e) => roleFilter('Delivery')}
        checked= {filter.includes('Delivery')}
         />
        <label htmlFor="Delivery">Delivery Partner</label>
        </>
      )}
      {client ? (
        <>
          <div>User: {client}</div>
          ***************************
          <br />
          {orders.map((order) => {
            return (
              filter.includes(order.as) && (
              <div key={order.orderId}>
                <div>Order Id: {order.orderId}</div>
                <div>Order Date: {order.orderDate}</div>
                <div>As : {order.as}</div>
                <br />
                {order.items.map((item) => {
                  return (
                    <div key={item.ItemID}>
                      <div>ItemID : {item.ItemID}</div>
                      <div>Item Description : {unescapeHTML(item.iDescription)}</div>
                      <br />
                    </div>
                  );
                })}
                <div><a onClick={() => nav("/order-details", {state :order.orderId})}>Get More Info..</a></div>
                ***************************
              </div>
              )
            );
          })}
        </>
      ) : (
      <div>{error}</div>
        )}
    </>
  );
}
