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
            disabled={props.disabled}
            onClick={props.onClick}
            className="flex justify-center items-center border border-blue-600 p-[1px] bg-gradient-to-b from-blue-400 to-blue-600 rounded-[8px] transition-transform duration-200 hover:scale-97 will-change-transform"
        >
            <div
                className={clsx(
                    "w-full h-[40px] min-h-[40px] max-h-[40px] px-4",
                    "flex flex-col justify-center items-center",
                    "rounded-md",
                    props.disabled && "cursor-default bg-white",
                    !props.disabled && "cursor-pointer bg-gradient-to-b from-blue-500 from-50% to-blue-600",
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
            </div>
        </button>
    )
}