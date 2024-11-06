import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Room from "./pages/Room/Room"
import Room2 from "./pages/Room/test/Room";
import Home from "./Home";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/:id',
    element: <Room />
  },
  {
    path: '/test/:id',
    element: <Room2/>
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
