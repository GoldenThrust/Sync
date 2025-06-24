export default function googleOAuth(redirectUrl) {
    return () => {
        axios.get('auth/google/url')
            .then(response => {
                window.location.href = response.data.url + redirectUrl ? `?redirect=${redirectUrl}` : '';
            })
            .catch(error => {
                console.error('Error fetching Google auth URL:', error);
            });
    }
}