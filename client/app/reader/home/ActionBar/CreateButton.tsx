import { PlusIcon, TrashIcon } from "lucide-react";

export interface CreateButtonProps {
    onClick: () => void;
}

export default function CreateButton(props: CreateButtonProps) {
    return (
        <button 
            onClick={props.onClick}
            className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-md shadow-sm"
        >
            <PlusIcon
                size={14}
                strokeWidth={1.5}
                className="stroke-neutral-600"
            />
        </button>
    )
}