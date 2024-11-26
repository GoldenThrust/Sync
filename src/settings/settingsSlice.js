import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    video: null,
    audio: null,
    languages: null,
    settings: null
}

const settingsSlice = createSlice({
    name: 'stream',
    initialState,
    reducers: {
        setVideo: (state, action) => {
            state.socket = action.payload;
        },
        setAudio: (state, action) => {
            state.stream = action.payload;
        },
        setLanguages: (state, action) => {
            state.languages = action.payload;
        },
        setSettings: (state, action) => {
            state.settings = action.payload;
        }
    }
})

export const { setAudio, setVideo, setLanguages, setSettings } = settingsSlice.actions
export default settingsSlice.reducer;