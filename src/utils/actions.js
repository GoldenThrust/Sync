export function endCall(socket, navigate, mediaStream) {
    if (socket) {
        socket.emit('end-call');
    }
    mediaStream?.getTracks().forEach((track) => track.stop());
    navigate('/lobby/initiate', { replace: true });
}

export function toggleCamera(updateSettings, settings) {
    return (dispatch) => {
        const enabledVideo = !settings.settings.enabledVideo;
        dispatch(updateSettings({
            ...settings,
            settings: { ...settings.settings, enabledVideo }
        }));
    };
}

export function toggleAudio(updateSettings, settings) {
    return (dispatch) => {
        const enabledAudio = !settings.settings.enabledAudio;
        dispatch(updateSettings({
            ...settings,
            settings: { ...settings.settings, enabledAudio }
        }));
    };
}

export function toggleFacingMode(updateSettings, settings, mediaStream) {
    return (dispatch) => {
        const facingMode = settings.settings.video.facingMode === "user" ? "environment" : "user";
        dispatch(updateSettings({
            ...settings,
            settings: {
                ...settings.settings,
                video: {
                    ...settings.settings.video,
                    facingMode,
                },
            },
        }));
        mediaStream?.getTracks().forEach((track) => track.stop());
    };
}
