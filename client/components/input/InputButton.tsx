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


    const disabled = props.disabled;
    const isBlue = !props.disabled && (!props.style || props.style === "black");
    const isBlack = !props.disabled && props.style === "blue";


    return (
        <button
            onClick={onClick}
            disabled={props.disabled}
            className={clsx(
                "w-full h-[36px] p-[1px] rounded-md",
                disabled && "bg-zinc-900 cursor-default",
                isBlack && "bg-zinc-900",
                isBlue && "bg-blue-400",
            )}
        >
            <div 
                className={clsx(
                    "w-full h-full p-[1px] pb-[0px]",
                    "rounded-[5px] bg-linear-to-b",
                    disabled && "from-zinc-600 to-zinc-800",
                    isBlack && "cursor-pointer from-zinc-600 to-zinc-950",
                    isBlue && "cursor-pointer from-blue-100 to-blue-600",
                )}
            >
                <div 
                    className={clsx(
                        "w-full h-full flex justify-center items-center",
                        "rounded-[4px] bg-linear-to-b",
                        disabled && "bg-zinc-900",
                        isBlack && "cursor-pointer from-zinc-800 to-zinc-950 hover:from-zinc-900",
                        isBlue && "cursor-pointer from-blue-400 to-blue-500 hover:from-blue-500",
                    )}
                >
                    <span 
                        className={clsx(
                            "text-center font-medium tracking-wide",
                            disabled && "text-zinc-600",
                            isBlack && "text-white",
                            isBlue && "text-white",
                        )}
                    >
                        {props.label}
                    </span>
                </div>
            </div>
        </button>
    )
}