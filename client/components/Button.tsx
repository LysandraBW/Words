import clsx from "clsx";
import { ReactNode } from "react";

interface ButtonProps {
    iconL: ReactNode;
    iconR: ReactNode;
    label: string;
    onClick: () => void;
    labelClassName: string;
    outerClassName: string;
    innerClassName: string;
    innerMostClassName: string;
    disabled: boolean;
    red: boolean;
}

export default function Button(props: Partial<ButtonProps>) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className={clsx(
                "w-min px-4 py-1.5 flex justify-center items-center gap-x-2 group",
                "bg-blue-600 border border-blue-600 rounded-md",
                props.red && "!bg-neutral-900 border !border-neutral-800 rounded-md",
                // props.disabled && "cursor-default bg-white",
                // !props.disabled && "cursor-pointer bg-black border border-white",
                props.outerClassName
            )}
        >
            {props.iconL}
            <label 
                className={clsx(
                    "text-center text-sm font-medium whitespace-nowrap !text-shadow-none",
                    props.disabled && "cursor-default text-black",
                    !props.disabled && "cursor-pointer text-white",
                    props.red && "group-hover:text-red-500 transition-all",
                    props.labelClassName
                )}
            >
                {props.label}
            </label>
            {props.iconR}
        </button>
    )
}