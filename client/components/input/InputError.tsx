interface InputErrorProps {
    error: string;
}

export default function InputError(props: Partial<InputErrorProps>) {
    return (
        <>
            {!!props.error?.length &&
                <span className="text-sm text-red-500 tracking-wide">
                    {props.error}
                </span>
            }
        </>
    )
}