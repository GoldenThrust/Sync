import { loginRequest, loginSuccess, loginFailure, AuthResponse, AuthError, processingData, logout, verificationFailed } from './authSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';

export const login = (form) => async (dispatch) => {
  try {
    toast.loading("Signing you in...", { id: "login" })
    dispatch(loginRequest());
    const res = await axios.post('auth/login', form);
    const user = res.data.response;
    toast.success("Successfully signed in!", { id: "login" })
    dispatch(loginSuccess(user));
  } catch (error) {
    toast.error("Failed to sign in. Please try again.", { id: "login" })
    dispatch(loginFailure(error.response.data.response));
  }
};


export const logoutAction = () => async (dispatch) => {
  try {
    dispatch(processingData());
    const res = await axios.get('auth/logout');
    const user = res.data.response;
    dispatch(logout(user));
  } catch (error) {
    dispatch(AuthError(error.response.data.response));
  }
};


export const verify = () => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const res = await axios.get('auth/verify');
    const user = res.data.response;
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(verificationFailed(error.response.data.response));
  }
}

export const signup = (form, setOtpOpen) => async (dispatch) => {
  try {
    toast.loading("Creating your account...", { id: "signup" })
    dispatch(processingData());
    const res = await axios.post('auth/register', form);
    const response = await res.data;
    toast.success("Activation token sent", { id: "signup" })
    dispatch(AuthResponse(response));
    setOtpOpen(true);
  } catch (error) {
    toast.error("Sign up failed. Please try again.", { id: "signup" })
    dispatch(AuthError(error.response.data.response));
  }
};

export const forgotPassword = (form) => async (dispatch) => {
  try {
    toast.loading("Sending password reset link...", { id: "resetLink" })
    dispatch(processingData());
    const res = await axios.post('auth/forgot-password', form);
    const response = res.data.response;
    toast.success("Password reset link sent to your email!", { id: "resetLink" })
    dispatch(AuthResponse(response));
  } catch (error) {
    toast.error("Failed to send reset link. Please try again.", { id: "resetLink" })
    dispatch(AuthError(error.response.data.response));
  }
}


export const resetPassword = (crypto, form) => async (dispatch) => {
  try {
    toast.loading("Updating your password...", { id: "newPassword" })
    dispatch(processingData());
    const res = await axios.post(`auth/reset-password/${crypto}`, form);
    const response = res.data.response;
    toast.success("Password updated successfully!", { id: "newPassword" })
    dispatch(AuthResponse(response));
  } catch (error) {
    toast.error("Failed to update password. Please try again.", { id: "newPassword" })
    dispatch(AuthError(error.response.data.response));
  }
}

export const accountActivation = (crypto, otp) => async (dispatch) => {
  try {
    toast.loading("Verifying OTP......", { id: "otp" })
    dispatch(loginRequest());
    const res = await axios.get(`auth/activate/${crypto}/${otp}`);
    const user = res.data.response;
    dispatch(loginSuccess(user));
    toast.success("Account Activated", { id: "otp" })
  } catch (error) {
    dispatch(AuthError(error.response.data.response));
    toast.error(error.response.data.response, { id: "otp" })
  }
}

