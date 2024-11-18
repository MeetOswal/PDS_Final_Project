import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Login } from '../components/login.jsx';
import {RouterProvider, createBrowserRouter} from "react-router-dom";

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    
  },
  {
    path: 'login',
    element: <Login/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
