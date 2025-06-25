import axios from "axios";

export default function googleOAuth(redirectUrl) {
    return () => {
        axios.get(`auth/google/url${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`)
            .then(response => {
                window.location.href = response.data.url;
            })
            .catch(error => {
                console.error('Error fetching Google auth URL:', error);
            });
    }
}