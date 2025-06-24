import { useSearchParams } from "react-router-dom";

export default function useRedirect() {
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    return redirectUrl;
}