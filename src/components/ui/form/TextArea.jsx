import PropTypes from "prop-types"
import { useRef } from "react";

export default function TextArea({ data, register }) {
    const divRef = useRef();

    function onInputChange(e) {
        if (e.target.value) {
            divRef.current.classList.add('label-top');
        } else {
            divRef.current.classList.remove('label-top');
        }
    }

    return <label className="block relative" htmlFor={data.name}>
        <textarea {...register(data.name, { required: data.required || true})} className={`text-field-style w-full rounded-lg p-2 text-sm outline-none ${data.className || ''}`} onBlur={onInputChange} ></textarea>
        <div className="absolute top-4 -translate-y-1/2 left-2 pointer-events-none" ref={divRef} >{data.placeholder}</div>
    </label>
}

TextArea.propTypes = {
    data: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
}