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
import { verify } from "./authentication/authAction";

const NotAuthorized = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, navigate])

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
    // if (!isAuthenticated) {
      dispatch(verify());
    // }
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
        path: 'auth',
        element: <Authorized />,
        children: [
          {
            path: 'login',
            element: <Login />
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
          },
        ]
      },
      {
        path: 'meet',
        element: <NotAuthorized />,
        children: [
          {
            path: 'create',
            element: <CreateRoom />
          },
          {
            path: 'lobby/:id',
            element: <Lobby />
          },
          {
            path: 'room/:id',
            element: <Room />
          },
          {
            path: 'room/test/:id',
            element: <Room2 />
          }
        ]
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
