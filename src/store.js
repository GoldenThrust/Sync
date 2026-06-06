import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settings/settingsSlice.js"
import authReducer from "./authentication/authSlice.js"
import sessionReducer from "./session/sessionSlice.js"

const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        session: sessionReducer,
    }
})

export default store;