import { ChangeEvent } from "react";

interface InputCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}


export default function InputCheckbox(props: Partial<InputCheckboxProps>) {
    const onChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (!props.onChange)
            return;
        props.onChange(event.target.checked);
    }


    return (
        <label>
            <input
                type="checkbox"
                checked={props.checked}
                onChange={onChange}
            />
            <span className="text-red-500">
                {props.label}
            </span>
        </label>
    )
}