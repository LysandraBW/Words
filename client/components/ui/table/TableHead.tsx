import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import clsx from "clsx";

interface TableHeadProps {
    columns: string[];
    allSelected: boolean;
    onToggleAllCheckboxes: () => void;
}

export default function TableHead(props: TableHeadProps) {
    return (
        <>
            <div className="flex justify-center items-center bg-neutral-900 border-b border-neutral-800">
                <InputCheckbox
                    inputClassName="!shadow-none"
                    checked={props.allSelected}
                    onChange={props.onToggleAllCheckboxes}
                />
            </div>
            {props.columns.map((column, i) => (
                <div 
                    key={i} 
                    className="px-2 py-2 flex items-center border-l border-b border-neutral-800"
                >
                    <p 
                        className={clsx(
                            "text-xs font-medium text-neutral-500",
                            "whitespace-nowrap overflow-hidden text-ellipsis"
                        )}
                    >
                        {column}
                    </p>
                </div>
            ))}
        </>
    )
}