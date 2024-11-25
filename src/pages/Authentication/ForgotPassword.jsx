import { useForm } from "react-hook-form";
import AuthBackground from "../../components/ui/AuthBackground";
import FormField from "../../components/ui/form/FormField";
import Button from "../../components/ui/form/Button";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const hook = useForm();
    const { handleSubmit } = hook;

    const form = [
        { name: 'email', type: "email", placeholder: "Email Address" },
    ]

    const forgotPassword = () => {

    }


    return (
        <AuthBackground>
            <form onSubmit={handleSubmit(forgotPassword)} className="flex flex-col justify-center gap-5 h-screen w-3/4 md:w-1/2 items-center">
                <legend className="text-4xl font-mono font-bold">Forgot Password</legend>
                <FormField data={form} hook={hook} className="w-full" />

                <div className="w-full space-y-2">
                    <div className="text-end text-sm">Already have an account? <Link to={'/auth/login'}>Sign In</Link> </div>
                    <Button value="LOGIN" className="w-full font-bold" />
                </div>
            </form>
        </AuthBackground>
    );
}