import { TrashIcon } from "lucide-react";

export interface DeleteButtonProps {

}

export default function DeleteButton(props: DeleteButtonProps) {
    return (
        <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-neutral-800 border border-neutral-700 rounded-md shadow-sm">
            <TrashIcon
                size={14}
                strokeWidth={1.5}
                className="stroke-neutral-600"
            />
        </button>
    )
}