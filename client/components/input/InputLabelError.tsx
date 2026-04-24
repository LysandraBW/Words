interface InputLabelErrorProps {
    label: string;
}

export default function InputLabelError(props: Partial<InputLabelErrorProps>) {
    return (
        <span
            className="text-sm text-red-500 tracking-wide"
        >
            {props.label}
        </span>
    )
}