import IconButton from "@/components/ui/IconButton";
import { PlusIcon } from "lucide-react";

export interface CreateButtonProps {
    onClick: () => void;
}

export default function CreateButton(props: CreateButtonProps) {
    return (
        <IconButton
            Icon={PlusIcon}
            onClick={props.onClick}
        />
    )
}