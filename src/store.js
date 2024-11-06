import { configureStore } from "@reduxjs/toolkit";
import streamReducer from "./stream/streamSlice.js"

const store = configureStore({
    reducer: {
        stream: streamReducer
    }
})

export default store;