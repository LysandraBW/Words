import InputText from "@/components/input/InputText";
import useFilterObjects from "@/hooks/useFilterObject";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, MinusIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface NavigationProps {
    filter: ReturnType<typeof useFilterObjects>;

}

export default function Navigation(props: NavigationProps) {
    const [pageIndexValue, setPageIndexValue] = useState("");
    
    useEffect(() => {
        setPageIndexValue(String(props.filter.pageIndex + 1))
    }, [props.filter.pageIndex]);

    return (
        <div className="mx-2 p-2 flex justify-center gap-x-2 bg-neutral-900/50 border border-t-0 border-neutral-800 rounded-b-lg">
            <button className="p-1 h-[26px] aspect-square bg-neutral-800 border border-neutral-700 rounded-md shadow">
                <ChevronsLeftIcon
                    size={14}
                    strokeWidth={2}
                    className="stroke-neutral-600"
                />
            </button>
            <button className="h-[26px] aspect-square p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow">
                <ChevronLeftIcon
                    size={14}
                    strokeWidth={2}
                    className="stroke-neutral-600"
                />
            </button>
            <div className="flex items-center gap-x-1">
                <InputText
                    value={String(pageIndexValue)}
                    onBlur={() => props.filter.goToPageStr(pageIndexValue)}
                    inputBoxClassName="w-min !h-[26px] !max-h-[26px] !min-h-[26px] !px-1 !py-1 bg-neutral-800 border-neutral-700"
                    inputClassName="!block !min-w-[26px] !min-h-[26px] !max-h-[26px] !h-[26px] !text-xs !tracking-wide text-center"
                />
                <MinusIcon
                    size={14}
                    strokeWidth={2}
                    className="stroke-neutral-600 [transform:scaleX(0.75)]"
                />
                <InputText
                    value={String(props.filter.lastPageIndex+1)}
                    inputBoxClassName="w-min !h-[26px] !max-h-[26px] !min-h-[26px] !px-1 !py-1 bg-neutral-800 border-neutral-700"
                    inputClassName="!block !min-w-[26px] !min-h-[26px] !max-h-[26px] !h-[26px] !text-xs !tracking-wide text-center"
                />
            </div>
            <button className="h-[26px] aspect-square p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow">
                <ChevronRightIcon
                    size={14}
                    strokeWidth={2}
                    className="stroke-neutral-600"
                />
            </button>
            <button className="h-[26px] aspect-square p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow">
                <ChevronsRightIcon
                    size={14}
                    strokeWidth={2}
                    className="stroke-neutral-600"
                />
            </button>
        </div>
    )
}