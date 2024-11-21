import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { sanitizeInput } from "./utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Orders() {
  const [isStaff, setIsStaff] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemFields, setItemFields] = useState([{ id: 1, value: "" }]);
  const [result, setResult] = useState(null);
  const [orderData, setOrderData] = useState({
    client: "",
    orderNotes: "",
    orderDate: "",
    deliveredBy: "",
    deliveryDate: "",
    deliveredStatus: "",
  });

  const empty = [
    {
        client: "",
        orderNotes: "",
        orderDate: "",
        deliveredBy: "",
        deliveryDate: "",
        deliveredStatus: "",
      },
      [{ id: 1, value: "" }]
  ]
  const nav = useNavigate();
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
  }, []);

  const isNumber = (value) => {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(value);
  };

  const validateItems = () => {
    let validationError = null;

    itemFields.forEach((item) => {
      if (!isNumber(item.value)) {
        validationError = `Item number with ID ${item.id} is invalid.`;
      }
    });

    if (validationError) {
      setError(validationError);
      return false;
    } else {
      setError("");
      return true;
    }
  };

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

  const addItemField = () => {
    setItemFields((currentstate) => [
      ...currentstate,
      { id: currentstate.length + 1, value: "" },
    ]);
  };

  const removeItemField = (id) => {
    setItemFields(itemFields.filter((field) => field.id !== id));
  };

  const onItemChange = (id, value) => {
    setItemFields(
      itemFields.map((field) => (field.id == id ? { ...field, value } : field))
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");
    setError(null)
    const isValidItems = validateItems();

    if (isValidItems && orderData.client && orderData.orderDate && orderData.deliveryDate && orderData.deliveredBy ) {
      const itemIDs = itemFields.map((field) => field.value);
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
        setOrderData(empty[0])
        setItemFields(empty[1])
        setIsClient(false)

      } catch (error) {
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
              minDate={new Date()}
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
            {itemFields.map((field) => {
              return (
                <div key={field.id}>
                  <label htmlFor={`item-${field.id}`}>Item {field.id}</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => onItemChange(field.id, e.target.value)}
                  />
                  {field.id !== 1 && (
                    <a onClick={() => removeItemField(field.id)}>Delete</a>
                  )}
                  <br />
                </div>
              );
            })}
            <div>
              {" "}
              <a onClick={addItemField}>Add Item</a>
            </div>
            <button type="submit"> {!loading ? "Register" : "Sending"}</button>
          </>
        )}
        <br />
      </form>
      {error && <div>{error}</div>}
      {result && <div>{result}</div>}
    </>
  );
}
