import InputText from "@/components/input/InputText";
import useFilterObjects from "@/hooks/useFilterObject";
import { ChevronLeftIcon, ChevronRight, ChevronsLeftIcon, ChevronsRightIcon, MinusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import IconButton from "../IconButton";


interface NavigationBarProps {
    filter: ReturnType<typeof useFilterObjects>;
}


export default function NavigationBar(props: NavigationBarProps) {
    const [pageIndexValue, setPageIndexValue] = useState("");
    
    useEffect(() => {
        setPageIndexValue(String(props.filter.pageIndex + 1));
    }, [props.filter.pageIndex]);

    return (
        <div className="p-2 flex justify-center gap-x-2 bg-neutral-900 border border-t-0 border-neutral-800 rounded-b-lg">
            <IconButton
                Icon={ChevronsLeftIcon}
                onClick={() => props.filter.goToFirstPage()}
            />
            <IconButton
                Icon={ChevronLeftIcon}
                onClick={() => props.filter.goToPrevPage()}
            />
            <div className="flex items-center gap-x-1">
                <InputText
                    value={String(pageIndexValue)}
                    onChange={(value: string) => setPageIndexValue(value)}
                    onBlur={() => props.filter.goToPageStr(pageIndexValue)}
                    inputBoxClassName="w-min !h-[26px] !max-h-[26px] !min-h-[26px] !px-0 !py-1 bg-neutral-800 border-neutral-700"
                    inputClassName="!block !min-w-[26px] !min-h-[26px] !max-h-[26px] !h-[26px] !text-xs !tracking-wide text-center"
                />
                <MinusIcon
                    size={14}
                    strokeWidth={2}
                    className="stroke-neutral-500 [transform:scaleX(0.75)]"
                />
                <InputText
                    disabled
                    value={String(props.filter.lastPageIndex+1)}
                    inputBoxClassName="w-min !h-[26px] !max-h-[26px] !min-h-[26px] !px-0 !py-1 bg-neutral-800 border-neutral-700"
                    inputClassName="!block !min-w-[26px] !min-h-[26px] !max-h-[26px] !h-[26px] !text-xs !tracking-wide text-center"
                />
            </div>
            <IconButton
                Icon={ChevronRight}
                onClick={() => props.filter.goToNextPage()}
            />
            <IconButton
                Icon={ChevronsRightIcon}
                onClick={() => props.filter.goToLastPage()}
            />
        </div>
    )
}