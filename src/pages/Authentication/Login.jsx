import { useForm } from "react-hook-form";
import AuthBackground from "../../components/ui/AuthBackground";
import FormField from "../../components/ui/form/FormField";
import Button from "../../components/ui/form/Button";
import { Link, useSearchParams } from "react-router-dom";
import googleIcon from "../../assets/icons/google.svg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../authentication/authAction";
import axios from "axios";
import useRedirect from "../../hooks/useRedirect";
import googleOAuth from "../../utils/googleOAuth";

export default function Login() {
    const hook = useForm();
    const { handleSubmit } = hook;
    const dispatch = useDispatch();
    const { loginerror } = useSelector((state) => state.auth)
    const redirectUrl = useRedirect();

    const form = [
        { name: 'email', type: "email", placeholder: "Email Address", required: true },
        { name: 'password', type: "password", placeholder: "Password", required: true },
    ]



    const signIn = (data) => {
        console.log(data);
        dispatch(login(data, redirectUrl));
    }

    return (
        <AuthBackground>
            <form onSubmit={handleSubmit(signIn)} className="flex flex-col justify-center gap-5 h-screen w-3/4 md:w-1/2 items-center">
                <legend className="text-5xl font-mono font-bold">Sign In</legend>
                <FormField data={form} hook={hook} className="w-full" />

                {loginerror && <p className="text-red-600">{loginerror}</p>}
                <div className="w-full space-y-2">
                    <div className="flex justify-between">
                        <Link to='/auth/forgot-password'>Forgot Password</Link>
                        <span>
                            {`Don't have an account?`}  <Link to='/auth/signup'>Sign Up</Link> </span>
                    </div>
                    <Button value="LOGIN" className="w-full font-bold" />
                    <div className="text-center">OR</div>
                    <Button type="button" onClick={googleOAuth(redirectUrl)} value={<div className="flex justify-center gap-2"><img src={googleIcon} className="w-6" alt="Google Icon" /> Sign in with Google</div>} className="w-full font-bold" />
                </div>
            </form>
        </AuthBackground>
    );
}
