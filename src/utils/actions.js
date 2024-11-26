export function endCall(socket, navigate) {
    return () => {
        if (socket)
            socket.emit('end-call');
        navigate('/', { replace: true });
    }
};

export function toggleCamera(updateSettings, settings) {
    return (dispatch) => {
        dispatch(updateSettings({ ...settings, enabledVideo: !settings.enabledVideo }))
    }
}

export function toggleAudio(updateSettings, settings) {
    return (dispatch) => {
        dispatch(updateSettings({ ...settings, enabledAudio: !settings.enabledAudio }))
    }
}

export function toggleFacingMode(updateSettings, settings, mediaStream, setInitiated) {
    return (dispatch) => {
        const facingMode = settings.video.facingMode === "user" ? "environment" : "user";
        dispatch(updateSettings({ ...settings, video: { ...settings.video, facingMode } }));
        mediaStream?.getTracks().forEach((track) => track.stop());
        setInitiated(false);
    }
}