import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../../authentication/authAction.js';

export default function Logout() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(logoutAction())
    if (!isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, dispatch, navigate])

  return <></>
};
