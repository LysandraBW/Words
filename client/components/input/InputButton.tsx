import clsx from "clsx";

interface InputButtonProps {
    label: string;
    style: string;
    disabled: boolean;
    onClick: () => void;
}

export default function InputButton(props: Partial<InputButtonProps>) {
    const onClick = () => {
        if (props.disabled || !props.onClick)
            return;
        props.onClick();
    }

    return (
        <button
            onClick={onClick}
            disabled={props.disabled}
            className={clsx(
                "w-full h-[36px] p-[1px] rounded-md",
                props.disabled && "bg-zinc-900 cursor-default",
                (!props.disabled && (!props.style || props.style === "black")) && "bg-zinc-900",
                (!props.disabled && props.style === "blue") && "bg-blue-400",
            )}
        >
            <div 
                className={clsx(
                    "w-full h-full p-[1px] pb-[0px]",
                    "rounded-[5px] bg-linear-to-b",
                    props.disabled && "from-zinc-600 to-zinc-800",
                    (!props.disabled && (!props.style || props.style === "black")) && "cursor-pointer from-zinc-600 to-zinc-950",
                    (!props.disabled && props.style === "blue") && "cursor-pointer from-blue-100 to-blue-600",
                )}
            >
                <div 
                    className={clsx(
                        "w-full h-full flex justify-center items-center",
                        "rounded-[4px] bg-linear-to-b",
                        props.disabled && "bg-zinc-900",
                        (!props.disabled && (!props.style || props.style === "black")) && "cursor-pointer from-zinc-800 to-zinc-950 hover:from-zinc-900",
                        (!props.disabled && props.style === "blue") && "cursor-pointer from-blue-400 to-blue-500 hover:from-blue-500",
                    )}
                >
                    <span 
                        className={clsx(
                            "text-center font-medium tracking-wide",
                            props.disabled && "text-zinc-600",
                            (!props.disabled && (!props.style || props.style === "black")) && "text-white",
                            (!props.disabled && props.style === "blue") && "text-white",
                        )}
                    >
                        {props.label}
                    </span>
                </div>
            </div>
        </button>
    )
}