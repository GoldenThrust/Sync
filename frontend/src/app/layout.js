import { baseUrl } from '../lib/utils/constants.js';
import { Toaster } from "react-hot-toast";
import axios from "axios";

import "./globals.css";
import "@/lib/styles/app.css"
import Providers from "../lib/redux/provider.js";


export const metadata = {
  title: "Sync",
  description: "Sync is a real-time video conferencing web application that offers seamless communication experience with high-quality video and audio capabilities. The platform supports multi-user video conferencing, instant meetings, text chat, and more, making it ideal for both personal and professional use.",
};

axios.defaults.baseURL = `${baseUrl}/api`;
axios.defaults.withCredentials = true;


export default function RootLayout({ children, repo }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
