import { TrashIcon } from "lucide-react";

export interface DeleteButtonProps {

}

export default function DeleteButton(props: DeleteButtonProps) {
    return (
        <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-neutral-800/50 border border-neutral-800 rounded-md shadow-sm">
            <TrashIcon
                size={15}
                strokeWidth={1.5}
                className="stroke-neutral-500"
            />
        </button>
    )
}