import { XIcon } from "lucide-react";

interface CloseButtonProps {
    onClose: () => void;
}

export default function CloseButton(props: CloseButtonProps) {
    return (
        <XIcon
            size={20}
            onClick={props.onClose}
            strokeWidth={1.5}
            className="cursor-pointer text-zinc-500"
        />
    )
}