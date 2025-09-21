import { useForm } from "react-hook-form";
import AuthBackground from "../../components/ui/AuthBackground";
import FormField from "../../components/ui/form/FormField";
import Button from "../../components/ui/form/Button";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../authentication/authAction";
import { useDispatch } from "react-redux";

export default function ResetPassword() {
    const hook = useForm();
    const { token } = useParams();
    const dispatch = useDispatch();
    const { handleSubmit } = hook;

    const form = [
        { name: 'password', type: "password", placeholder: "Password" , required: true},
        { name: '_c', type: "password", placeholder: "Confirm Password", required: true },
    ]

    const onSubmit = (data) => {
        dispatch(resetPassword(token, data));
    }


    return (
        <AuthBackground>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-5 h-screen w-3/4 md:w-1/2 items-center">
                <legend className="text-4xl font-mono font-bold">Reset Password</legend>
                <FormField data={form} hook={hook} className="w-full" />

                <div className="w-full space-y-2">
                    <Button value="LOGIN" className="w-full font-bold" />
                </div>
            </form>
        </AuthBackground>
    );
}