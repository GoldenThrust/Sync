import InputField from "./inputField";
import TextArea from "./TextArea";

export default function FormField({ data, hook, className }) {
    const {
        register,
        formState: { errors },
    } = hook;

    return (
        data.map((val, key) => {
            if (val.type === 'textarea') {
                return <div key={key} className={className}>
                    <TextArea data={val} register={register} />
                    {errors[data.name] && <p role="alert" className="text-red-500">This field is required</p>}
                </div>
            } else {
                return <div key={key} className={className}>
                    <InputField data={val} register={register} />
                    {errors[data.name] && <p role="alert" className="text-red-500">This field is required</p>}
                </div>
            }
        }
        )
    )
}