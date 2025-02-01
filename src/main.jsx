import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Buffer } from 'buffer';
import process from 'process';
import App from './App';
import './App.css'
import { Provider } from 'react-redux';
import store from './store.js';
import { baseUrl } from './utils/constant.js';

window.Buffer = Buffer;
window.process = process;

axios.defaults.baseURL = `${baseUrl}/api`;
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" />
      <App />
    </Provider>
  </StrictMode>
);
