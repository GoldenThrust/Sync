import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { accountActivation } from "../../../authentication/authAction";

export default function Otp({ setOtpOpen }) {
    const dispatch = useDispatch();
    const { crypto  } = useSelector((state) => state.auth)
    const { register, handleSubmit, setValue, getValues, trigger } = useForm({
        defaultValues: { otp1: "", otp2: "", otp3: "", otp4: "" },
    });

    const onSubmit = (data) => {
        dispatch(accountActivation(crypto, Object.values(data).join("")));
    };

    const handleInputChange = async (e, index) => {
        const value = e.target.value;
        if (value.length === 1 && /^[0-9]$/.test(value)) {
            setValue(`otp${index}`, value);
            if (index < 4) {
                const nextInput = document.getElementById(`otp${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            } else {
                const values = getValues();
                if (Object.values(values).every((v) => v.trim() !== "")) {
                    await trigger();
                    handleSubmit(onSubmit)();
                }
            }
        } else {
            setValue(`otp${index}`, "");
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value) {
            const prevInput = document.getElementById(`otp${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    return (
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center z-20 bg-black bg-opacity-50">
            <form
                id="otp-form"
                className="w-96 p-6 rounded-lg border-2 border-blue-500 bg-gray-800 text-center text-white"
            >
                <h1 className="text-xl font-bold mb-4">Check your email for activation Token</h1>
                <div className="flex justify-center gap-4 mb-6">
                    {[1, 2, 3, 4].map((index) => (
                        <input
                            key={index}
                            type="text"
                            id={`otp${index}`}
                            maxLength="1"
                            {...register(`otp${index}`, { required: true })}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center text-lg bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => { setOtpOpen(false) }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Resend Token
                    </button>
                </div>
            </form>
        </div>
    );
}

Otp.propTypes = {
    setOtpOpen: PropTypes.func.isRequired
}