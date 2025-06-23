import PropTypes from "prop-types"
import { useForm } from "react-hook-form";

export default function OneFormField({ type, name, placeholder, className = '', FormIcon, SubmitIcon, OnSubmit }) {
    const {
        handleSubmit,
        register,
    } = useForm();

    return <form className={`h-12 flex justify-center ${className}`} onSubmit={handleSubmit(OnSubmit)}>
        <div className={`flex justify-center items-center text-field-style w-full rounded-lg text-sm outline-none rounded-e-none`}>
            {FormIcon}<input type={type} {...register(name)} placeholder={placeholder} className="w-5/6 p-2 h-5/6 bg-transparent outline-none text-gray-300" />
        </div>
        <button type="submit" className={`button-style rounded-lg outline-none flex justify-center items-center h-full aspect-square rounded-s-none`} >{SubmitIcon}</button>
    </form>
}

OneFormField.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    FormIcon: PropTypes.object.isRequired,
    SubmitIcon: PropTypes.object.isRequired,
    OnSubmit: PropTypes.func.isRequired,
}