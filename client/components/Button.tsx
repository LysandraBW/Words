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
}

export default function Button(props: Partial<ButtonProps>) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className={clsx(
                "w-full h-[40px] min-h-[40px] max-h-[40px] px-4",
                "justify-center align-center",
                "rounded-md",
                props.disabled && "cursor-default bg-white",
                !props.disabled && "cursor-pointer bg-black border border-white",
                props.outerClassName
            )}
        >
           {props.iconL}
            <label 
                className={clsx(
                    "text-center text-sm font-medium",
                    props.disabled && "cursor-default text-black",
                    !props.disabled && "cursor-pointer text-white",
                    props.labelClassName
                )}
            >
                {props.label}
            </label>
            {props.iconR}
        </button>
    )
}