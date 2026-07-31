import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import { ChangeEvent } from "react";

interface InputCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    inputClassName: string;
}


export default function InputCheckbox(props: Partial<InputCheckboxProps>) {
    const onChange = (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        if (!props.onChange)
            return;
        props.onChange(!props.checked);
    }


    return (
        <label 
            className="block"
            onClick={onChange}    
        >
            {/* <input
                type="checkbox"
                checked={props.checked}
                onChange={onChange}
            /> */}
            <div
                className={clsx(
                    "!w-[16px] !h-[16px] flex justify-center items-center rounded-sm bg-neutral-800 border border-neutral-600 shadow-sm",
                    props.checked && "!bg-blue-600 !border-blue-500"
                )}
            >
                {props.checked &&
                    <CheckIcon
                        size={10}
                        strokeWidth={3}
                        className="stroke-neutral-100"
                    />
                }
            </div>
            {props.label &&
                <span className="text-red-500">
                    {props.label}
                </span>
            }
        </label>
    )
}