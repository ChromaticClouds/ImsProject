import { createBrowserRouter } from "react-router-dom";

/**
 * Pages
 */
import { App } from "@/app/app";
import { Home } from "@/pages/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Home /> }],
  },
]);
