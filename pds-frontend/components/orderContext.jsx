import React, {createContext, useEffect, useState} from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [client, setClient] = useState(null)
  const addItem = (itemID) =>
    setItems((currentContext) => {
      if (currentContext.includes(itemID)) {
        return currentContext.filter((item) => item !== itemID);
      } else {
        return [...currentContext, itemID];
      }
    });

    const deleteAll = () => {
      setItems([]);
      setClient(null);
      return
    }
  
    const addClient = (username) => setClient(username) 
  
    useEffect(() => {
      console.log(items);
    }, [items])

  return (
    <OrderContext.Provider value={{ items, addItem, addClient, client, deleteAll }}>
      {children}
    </OrderContext.Provider>
  );
};
