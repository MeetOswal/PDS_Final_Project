import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Login } from "../components/login.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RegisterUser } from "../components/registerUser.jsx";
import { GetItem } from "../components/GetItem.jsx";
import { GetOrder } from "../components/GetOrder.jsx";
import { OrderHistory } from "../components/orderHistory.jsx";
import { Category } from "../components/Categories.jsx";
import { Filter } from "../components/Filters.jsx";
import { VolunteerTasks } from "../components/VolunteerTasks.jsx";
import { SupervisionTasks } from "../components/SupervisionTasks.jsx";
import { UserPorfile } from "../components/UserProfile.jsx";
import { Donate } from "../components/Donate.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <RegisterUser />,
  },
  {
    path: "/get-item",
    element: <GetItem />,
  },
  {
    path: "/order-details",
    element: <GetOrder />,
  },
  {
    path: "/order-history",
    element: <OrderHistory />,
  },
  {
    path: "/categories",
    element: <Category />,
  },
  {
    path: "/filter",
    element: <Filter />,
  },
  {
    path: "/volunteer-task",
    element: <VolunteerTasks />,
  },
  {
    path: "/supervision-task",
    element: <SupervisionTasks />,
  },
  {
    path : "/profile",
    element : <UserPorfile />
  },
  {
    path : "/donate",
    element : <Donate/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
