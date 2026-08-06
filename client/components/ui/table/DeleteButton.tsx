import IconButton from "@/components/ui/IconButton";
import { TrashIcon } from "lucide-react";

export interface DeleteButtonProps {
    onClick: () => void;
}

export default function DeleteButton(props: DeleteButtonProps) {
    return (
        <IconButton
            Icon={TrashIcon}
            onClick={props.onClick}
        />
    )
}