import { createBrowserRouter } from "react-router-dom";

/**
 * Pages
 */
import { App } from "@/app/app.jsx";
import { Home } from "@/pages/home.jsx";
import { Login } from "@/pages/login.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
    ],
  },
]);
