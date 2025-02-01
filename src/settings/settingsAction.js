import axios from "axios"
import { setSettings } from "./settingsSlice";

export const initiateSettings = (settings) => async (dispatch) => { //  initialize temporary
    try {
        dispatch(setSettings(settings));
        axios.post('/settings/initiate', settings);
    } catch (err) {
        console.error('Error initiating settings:', err);
    }
}

export const updateSettings = (settings) => async (dispatch) => {
    try {
        dispatch(setSettings(settings));
        await axios.put('/settings/update', settings);
    } catch (err) {
        console.error('Error updating settings:', err);
    }
}

export const getSettings = () => async (dispatch) => {
    try {
        const res = await axios.get('/settings/get');
        const settings = res.data;
        dispatch(setSettings(settings));
    } catch (err) {
        console.error('Error getting settings:', err);
        return null;
    }
}