"use client";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { logoutAction } from '../../../lib/authentication/authAction.js';

export default function Logout() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(logoutAction())
  }, [isAuthenticated, dispatch])

  return <></>
};
