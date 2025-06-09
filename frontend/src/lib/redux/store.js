import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../settings/settingsSlice.js"
import authReducer from "../authentication/authSlice.js"

const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer
    }
})

export default store;