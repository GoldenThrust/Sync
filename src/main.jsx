import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Buffer } from 'buffer';
import process from 'process';
import App from './App';

window.Buffer = Buffer;
window.process = process;

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster position="top-right" />
    <App />
  </StrictMode>
);
