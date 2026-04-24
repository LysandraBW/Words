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
    style: string;
}

export default function Button(props: Partial<ButtonProps>) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className={clsx(
                "w-full h-[36px] min-h-[36px] max-h-[36px] px-2",
                "justify-center align-center",
                "rounded-md", 
                props.disabled && "bg-zinc-900 cursor-default",
                (!props.disabled && (!props.style || props.style === "black")) && "cursor-pointer bg-zinc-900",
                (!props.disabled && props.style === "blue") && "cursor-pointer bg-blue-500 hover:bg-blue-600",
                props.outerClassName
            )}
        >
           {props.iconL}
            <label 
                className={clsx(
                    "text-center text-sm font-bold",
                    props.disabled && "text-zinc-600 cursor-default",
                    (!props.disabled && (!props.style || props.style === "black")) && "cursor-pointer text-white",
                    (!props.disabled && props.style === "blue") && "cursor-pointer text-white",
                    props.labelClassName
                )}
            >
                {props.label}
            </label>
            {props.iconR}
        </button>
    )
}