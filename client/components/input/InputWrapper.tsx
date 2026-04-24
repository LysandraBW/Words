import { ReactNode } from "react"

interface InputWrapperProps {
    children: ReactNode;
}

export default function InputWrapper(props: InputWrapperProps) {
    return (
        <div className="flex flex-col gap-y-1">
            {props.children}
        </div>
    )
}