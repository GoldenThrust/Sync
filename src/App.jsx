import { createBrowserRouter, RouterProvider, useNavigate, Outlet } from "react-router-dom";
import Room from "./pages/Room/Room"
import Room2 from "./pages/Room/test/Room";
import Home from "./pages/Home";
import Login from "./pages/Authentication/Login";
import SignUp from "./pages/Authentication/SignUp";
import ResetPassword from "./pages/Authentication/ResetPassword";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import CreateRoom from "./pages/Room/lobby/CreateRoom";
import Lobby from "./pages/Room/lobby/Meet";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error404 from "./pages/404";
import ErrorPage from "./pages/error";
import { verify } from "./authentication/authAction";
import Logout from "./pages/Authentication/Logout";

const NotAuthorized = () => {
  return <Outlet />
}
const Authorized = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate])

  return <Outlet />
}

const Base = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(verify());
    }
  }, [dispatch, isAuthenticated]);

  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Base />,
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: 'error',
        element: <ErrorPage />
      },
      {
        path: 'auth',
        element: <Authorized />,
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'logout',
            element: <Logout />
          },
          {
            path: 'signup',
            element: <SignUp />
          },
          {
            path: 'reset-password',
            element: <ResetPassword />
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />
          }
        ]
      },
      {
        path: 'meet',
        element: <NotAuthorized />,
        children: [
          {
            path: 'initiate',
            element: <CreateRoom />
          },
          {
            path: 'waiting-room/:id',
            element: <Lobby />
          }
        ]
      },
      {
        path: "room",
        element: <NotAuthorized />,
        children: [{
          path: ':id',
          element: <Room />
        },
        {
          path: 'test/:id',
          element: <Room2 />
        }]
      }
    ]
  }
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
