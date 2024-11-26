import { model, Schema } from 'mongoose';

const SettingsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    audio: {
        type: Object,
        default: {
            "autoGainControl": true,
            "channelCount": 2,
            "echoCancellation": true,
            "latency": 0.01,
            "noiseSuppression": true,
            "sampleRate": 48000,
            "sampleSize": 16,
            "voiceIsolation": false
        }
    },
    video: {
        type: Object,
        default: {
            "aspectRatio": 1.7777777777777777,
            "brightness": 0,
            "colorTemperature": 4000,
            "contrast": 32,
            "exposureMode": "continuous",
            "exposureTime": 312.5,
            "facingMode": "user",
            "frameRate": 30,
            "height": 720,
            "resizeMode": "none",
            "saturation": 64,
            "sharpness": 0,
            "whiteBalanceMode": "continuous",
            "width": 1280
        }
    },
    language: {
        type: String,
        default: 'en'
    },
    enabledAudio: {
        type: Boolean,
        default: true
    },
    enabledVideo: {
        type: Boolean,
        default: true
    },
    
})

const Settings = model('Settings', SettingsSchema);
export default Settings;
