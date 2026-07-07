import { LayoutGridIcon, LayoutListIcon } from "lucide-react";

interface DisplayButtonProps {

}

export default function DisplayButton(props: DisplayButtonProps) {
    return (
        <div className="relative w-min flex gap-x-[1px] bg-neutral-800 rounded-md">
            <div className="absolute h-full w-[1px] left-[calc(50%+1px)] bg-blue-500"/>
            <button className="p-1 w-[26px] h-[26px] flex justify-center items-center bg-blue-700 border border-r-0 border-blue-500 rounded-l-md shadow-sm">
                <LayoutListIcon
                    size={14}
                    strokeWidth={1.5}
                    className="stroke-neutral-200"
                />
            </button>
            <button className="p-1 bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-md">
                <LayoutGridIcon
                    size={14}
                    strokeWidth={1.5}
                    className="stroke-neutral-600"
                />
            </button>
        </div>
    )
}