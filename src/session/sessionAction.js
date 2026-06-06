import axios from 'axios';
import toast from 'react-hot-toast';
import { loading, sessionError, sessionResponse } from './sessionSlice';
import { getSettings } from '../settings/settingsAction';

export const getActiveSessionUsersUsername = (id) => async (dispatch) => {
  try {
    toast.loading("loading session...", { id: "session" })
    dispatch(loading());
    const res = await axios.get(`meet/get-active-users/${id}`);
    const response = res.data;
    toast.success("starting....", { id: "session" })
    dispatch(sessionResponse(response));
  } catch (error) {
    console.error("getActiveSessionUsersUsername error:", error);
    toast.error("failed....", { id: "session" })
    dispatch(sessionError(error.response.data.response));
  }
}
