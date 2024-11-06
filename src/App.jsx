import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Room from "./pages/Room/Room.jsx"
import Room2 from "./pages/Room/test/Room.jsx";
import Home from "./Home.jsx";

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
