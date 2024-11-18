import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Login } from '../components/login.jsx';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import { RegisterUser } from '../components/registerUser.jsx';

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
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
