import os from "os";

export default function createOTP() {
    let otp = "";

    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
}


export function getIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const net of networkInterfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'IP address not found';
}