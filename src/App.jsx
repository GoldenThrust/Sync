import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Test from "./pages/Test";

const router = createBrowserRouter([
  {
    path: '/:id',
    element: <Test />
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
