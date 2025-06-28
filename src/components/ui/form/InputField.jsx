import PropTypes from "prop-types"
import { useRef } from "react";

export default function InputField({ data, color, register }) {
    const divRef = useRef();

    function onInputChange(e) {
        if (e.target.value) {
            divRef.current.classList.add('label-top');
        } else {
            divRef.current.classList.remove('label-top');
        }
    }

    if (data.type === 'select') {
        return <label className="block relative" htmlFor={data.name}>
            {data.header && <span className="text-sm font-semibold mb-1 block">{data.header}</span>}
            <select
                {...register(data.name)}
                className={`text-field-style rounded-lg p-3 w-full text-sm outline-none ${data.className || ''}`}
                id={data.name}
                style={{ color: color || 'inherit' }}
            >
                {!data.header && <option value="">{data.placeholder}</option>}
                {data.options.map((option, index) => (
                    <option className="text-black" key={index} value={option}>{option}</option>
                ))}
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none" ref={divRef} >{data.placeholder}</div>
        </label>
    } else {
        return (
            <>
                {data.header && <span className="text-sm font-semibold mb-1 block">{data.header}</span>}
                <label className="block relative" htmlFor={data.name}>
                    <input type={data.type} id={data.name} {...register(data.name, { required: data.required })} className={`text-field-style rounded-lg p-3 w-full text-sm outline-none ${data.className || ''}`} defaultValue={data.value || ''} onBlur={onInputChange} style={{ color: color || 'inherit' }} placeholder={data.header && data.placeholder}/>
                    {!data.header && <div className="absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none" ref={divRef} >{data.placeholder}</div>}
                </label>
            </>
        )
    }
}

InputField.propTypes = {
    data: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired
}