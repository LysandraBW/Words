import clsx from "clsx";
import { ChangeEvent } from "react";

interface InputCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    inputClassName: string;
}


export default function InputCheckbox(props: Partial<InputCheckboxProps>) {
    const onChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if (!props.onChange)
            return;
        props.onChange(event.target.checked);
    }


    return (
        <label className="block">
            {/* <input
                type="checkbox"
                checked={props.checked}
                onChange={onChange}
            /> */}
            <div
                className={clsx(
                    "w-[18px] h-[18px] bg-white border border-black",
                    props.inputClassName
                )}
            />
            {props.label &&
                <span className="text-red-500">
                    {props.label}
                </span>
            }
        </label>
    )
}