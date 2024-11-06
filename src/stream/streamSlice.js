import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    socket: null,
    stream: null,
}

const streamSlice = createSlice({
    name: 'stream',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setMediaStream: (state, action) => {
            state.stream = action.payload;
        },
    }
})

export const { setSocket, setMediaStream, updateConstraints } = streamSlice.actions
export default streamSlice.reducer;