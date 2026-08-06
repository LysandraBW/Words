import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import { ChangeEvent } from "react";

interface InputCheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    inputClassName: string;
    labelClassName: string;
}


export default function InputCheckbox(props: Partial<InputCheckboxProps>) {
    const onChange = (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        if (!props.onChange)
            return;

        console.log('a');
        props.onChange(!props.checked);
    }


    return (
        <label 
            className="block flex gap-x-2 items-center"
            onClick={onChange}    
        >
            <div className="p-1">
                <div
                    className={clsx(
                        "!w-[16px] !h-[16px] flex justify-center items-center rounded-sm bg-neutral-800 hover:bg-neutral-900 border border-neutral-600 shadow-sm cursor-pointer",
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
            </div>
            {props.label &&
                <span 
                    className={clsx(
                        "text-neutral-400",
                        props.checked && "!text-neutral-300",
                        props.labelClassName
                    )}
                >
                    {props.label}
                </span>
            }
        </label>
    )
}