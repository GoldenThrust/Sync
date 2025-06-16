export const toggleTrack = (mediaStream, trackType, enable) => {
    const track = mediaStream.getTracks().find((t) => t.kind === trackType);
    if (track) {
        track.enabled = enable;
        console.log(`${trackType} track ${enable? 'enabled' : 'disabled'}`);
    } else {
        console.log(`No ${trackType} track found.`);
    }
};