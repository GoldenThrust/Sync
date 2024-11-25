import PropTypes from "prop-types"
import { useRef } from "react";

export default function InputField({ data, register }) {
    const divRef = useRef();

    function onInputChange(e) {
        if (e.target.value) {
            divRef.current.classList.add('label-top');
        } else {
            divRef.current.classList.remove('label-top');
        }
    }



    return <label className="block relative" htmlFor={data.name}>
        <input type={data.type} {...register(data.name, { required: data.required })} className={`text-field-style rounded-lg p-3 w-full text-sm outline-none ${data.className || ''}`} onBlur={onInputChange} />
        <div className="absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none" ref={divRef} >{data.placeholder}</div>
    </label>
}

InputField.propTypes = {
    data: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired
}