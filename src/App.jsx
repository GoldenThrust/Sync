import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Room from "./pages/Room/Room"

const router = createBrowserRouter([
  {
    path: '/:id',
    element: <Room />
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
