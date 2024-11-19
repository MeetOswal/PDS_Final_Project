import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Login } from '../components/login.jsx';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { RegisterUser } from '../components/registerUser.jsx';
import { GetItem } from '../components/GetItem.jsx';
import { GetOrder } from '../components/GetOrder.jsx';
import { OrderHistory } from '../components/orderHistory.jsx';
import { Category } from '../components/Categories.jsx';
import { Filter } from '../components/Filters.jsx';
const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
  },
  {
    path: 'login',
    element: <Login/>
  },
  {
    path: 'register',
    element: <RegisterUser/>
  },
  {
    path: "/get-item",
    element : <GetItem/>
  },
  {
    path: "/order-details",
    element : <GetOrder/>
  },
  {
    path: "/order-history",
    element : <OrderHistory/>
  },
  {
    path: "/categories",
    element : <Category/>
  },
  {
    path : "/filter",
    element : <Filter/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
