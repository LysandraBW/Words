import InputDropdown, { Option } from "@/components/input/InputDropdown";
import useFilterObjects, { ASCENDING, DESCENDING } from "@/hooks/useFilterObject";
import clsx from "clsx";
import { MoveDownIcon, MoveUpIcon } from "lucide-react";

export interface SortProps {
    options: Option<string>[];
    filter: ReturnType<typeof useFilterObjects>;
}

export default function Sort(props: SortProps) {
    return (
         <div className="h-full flex items-center">
            <InputDropdown
                options={props.options}
                onChange={props.filter.setSortKey}
                toggleLabel={"Sort by" + ` ${(props.options.find(option => option.value === props.filter.sortKey)?.textLabel || "").trim()}`}
                wrapperClassName="min-w-[128px] !min-h-full !max-h-full !flex !flex-col !justify-center"
                boxClassName="!min-h-min !h-min !max-h-min"
                toggleClassName="box-content !min-h-[18px] !max-h-[18px] !h-[18px] p-1 pl-2 pr-1 !gap-x-2 !bg-neutral-800 !border-neutral-700 !rounded-l-md !rounded-r-none shadow-sm"
                toggleLabelClassName="!text-xs !tracking-wide  whitespace-nowrap"
            />
            <button
                className="h-[28px] w-[28px] flex justify-center items-center -space-x-2.5 bg-neutral-800 border border-l-0 border-neutral-700 hover:bg-neutral-800/50 cursor-pointer rounded-r-md"
                onClick={() => {
                    if (!props.filter.sortKey) {
                        return;
                    }
                    props.filter.goToNextSortDirection(props.filter.sortDirection)
                }}
            >
                <MoveUpIcon
                    size={16}
                    strokeWidth={1.5}
                    className={clsx(
                        props.filter.sortDirection === ASCENDING && '!text-neutral-100',
                        "text-neutral-500 [transform:scaleY(0.75)]"
                    )}
                />
                <MoveDownIcon
                    size={16}
                    strokeWidth={1.5}
                    className={clsx(
                        props.filter.sortDirection === DESCENDING && '!text-neutral-100',
                        "text-neutral-500 [transform:scaleY(0.75)]"
                    )}
                />
            </button>
        </div>
    )
}