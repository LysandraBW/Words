import clsx from "clsx";
import { ReactNode } from "react"

interface InputWrapperProps {
    children: ReactNode;
    className: string;
}

export default function InputWrapper(props: Partial<InputWrapperProps>) {
    return (
        <div 
            className={clsx(
                "flex flex-col gap-y-1",
                props.className
            )}
        >
            {props.children}
        </div>
    )
}