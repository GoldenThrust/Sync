import { configureStore } from "@reduxjs/toolkit";
import streamReducer from "./stream/streamSlice.js"
import authReducer from "./authentication/authSlice.js"

const store = configureStore({
    reducer: {
        auth: authReducer,
        stream: streamReducer
    }
})

export default store;