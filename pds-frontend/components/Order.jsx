import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { sanitizeInput } from "./utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useContext } from "react";
import { OrderContext } from "./orderContext";


export function Orders() {
  const [isStaff, setIsStaff] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { items, addItem, addClient, client, deleteAll } = useContext(OrderContext);
  const nav = useNavigate();

  const [orderData, setOrderData] = useState({
    client: "",
    orderNotes: "",
    orderDate: "",
    deliveredBy: "",
    deliveryDate: "",
    deliveredStatus: "",
  });

  const empty = {
        client: "",
        orderNotes: "",
        orderDate: "",
        deliveredBy: "",
        deliveryDate: "",
        deliveredStatus: "",
      }
  
  useEffect(() => {
    const checkStaff = async () => {
      try {
        await axios.get(`http://127.0.0.1:5000/api/check/staff`, {
          withCredentials: true,
        });

        setIsStaff(true);
      } catch (error) {
        console.log(error);
        if (error.response) {
          setError(error.response.data.error);
        } else {
          nav("/");
        }
      }
    };
    checkStaff();

    if (client) {
      setOrderData((currentState) => ({
        ...currentState,
        client: client
      }))
      setIsClient(true);
    }
  }, []);

  const checkClient = async (e) => {
    e.preventDefault();
    if (orderData.client.length > 0) {
      try {
        await axios.get(
          `http://127.0.0.1:5000/api/check/client/${sanitizeInput(
            orderData.client
          )}`,
          {
            withCredentials: true,
          }
        );
        setIsClient(true);
        addClient(orderData.client)
      } catch (error) {
        setIsClient(false);

        if (error.response) {
          setError(error.response.data.error);
        } else {
          nav("/");
        }
      }
    }
  };

  const checkDelivery = () => {
    if (orderData.deliveredBy === orderData.client){
      setError('client and delivery partner cannot be same');
      return false;
    } else {
      setError(null);
      return true;
    }
  }




  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");
    setError(null)

    if (orderData.client && orderData.orderDate && orderData.deliveryDate && orderData.deliveredBy && checkDelivery()) {
      const itemIDs = items;
      const orderDate = new Date(orderData.orderDate).toISOString().split("T")[0];
      const deliveryDate = new Date(orderData.deliveryDate).toISOString().split("T")[0];
      const formData = new FormData();
      formData.append("username", sanitizeInput(orderData.client));
      formData.append("orderNotes", sanitizeInput(orderData.orderNotes));
      formData.append("orderDate", orderDate);
      formData.append("deliveredBy", sanitizeInput(orderData.deliveredBy));
      formData.append("deliveredDate", deliveryDate);
      formData.append("deliveredStatus", sanitizeInput(orderData.deliveredStatus));
      formData.append("itemID", itemIDs);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/createorder",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setResult(response.data.message);
        setOrderData(empty)
        setIsClient(false)
        deleteAll();
        

      } catch (error) {
        console.log(error);
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }else{
        setLoading(false);
    }
  };

  if (!isStaff) {
    return (
      <div>
        <Link to="/">Home</Link>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <>
      <Link to="/">Home</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="clinet">Client </label>
        <input
          type="text"
          value={orderData.client}
          onChange={(e) =>
            setOrderData((currentState) => ({
              ...currentState,
              client: e.target.value,
            }))
          }
          required
        />

        <button onClick={(e) => checkClient(e)}>Enter Client</button>
        <br />
        {isClient && (
          <>
            <label htmlFor="orderNotes">Order Notes</label>
            <input
              type="text"
              value={orderData.orderNotes}
              onChange={(e) =>
                setOrderData((currentState) => ({
                  ...currentState,
                  orderNotes: e.target.value,
                }))
              }
            />
            <br />
            <label htmlFor="orderDate">Order Date</label>
            <DatePicker
              selected={orderData.orderDate}
              placeholderText="MM/DD/YYYY"
              onChange={(date) =>
                setOrderData((currentState) => ({
                  ...currentState,
                  orderDate: date,
                }))
              }
              required
            />
            <br />
            <label htmlFor="deliveredBy">Delivery Partner Username</label>
            <input
              type="text"
              value={orderData.deliveredBy}
              onChange={(e) =>
                setOrderData((currentState) => ({
                  ...currentState,
                  deliveredBy: e.target.value,
                }))
              }
              required
            />
            <br />
            <label htmlFor="deliveryDate">Delivery Date</label>
            <DatePicker
              selected={orderData.deliveryDate}
              placeholderText="MM/DD/YYYY"
              onChange={(date) =>
                setOrderData((currentState) => ({
                  ...currentState,
                  deliveryDate: date,
                }))
              }
              minDate={orderData.orderDate}
              required
            />
            <br />
            <label htmlFor="deliveryStatus">Delivery Status</label>
            <input
              type="text"
              value={orderData.deliveredStatus}
              onChange={(e) =>
                setOrderData((currentState) => ({
                  ...currentState,
                  deliveredStatus: e.target.value,
                }))
              }
              required
            />
            <br />
            <div>Order Items</div>
            {items.map((field, index) => {
              return (
                <div key={index}>
                  <label htmlFor={`item-${index}`}>Item : {field} </label>
                  <a onClick={() => addItem(field)}>Delete</a>
                  <br />
                </div>
              );
            })}
            <div>
              {" "}
              <a onClick={() => nav('/categories')}>Add Item</a>
            </div>
            <button type="submit"> {!loading ? "Register" : "Sending"}</button>
          </>
        )}
        <br />
      </form>
      {result && <div>{result}</div>}
      {error && <div>{error}</div>}
      
    </>
  );
}
