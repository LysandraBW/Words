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
                    "!w-[14px] !h-[14px] rounded-sm !bg-neutral-800 border !border-neutral-600 shadow-md",
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