import InputDropdown, { Option } from "@/components/input/InputDropdown";
import InputText from "@/components/input/InputText";
import useFilterObjects from "@/hooks/useFilterObject";

export interface SearchProps {
    options: Option<string>[];
    filter: ReturnType<typeof useFilterObjects>;
}

export default function Search(props: SearchProps) {
    return (
         <div className="h-full flex items-center">
            <InputText
                onChange={props.filter.setSearch}
                placeholder="Search"
                inputWrapperClassName="!w-full"
                inputBoxClassName="!p-1 !min-h-auto !max-h-auto !h-auto !bg-neutral-800/50 !rounded-l-md !rounded-r-none !border-neutral-800"
                inputClassName="!block !px-2 !min-h-[18px] !max-h-[18px] !h-[18px] !p-0 !pl-2 !text-xs !tracking-wide"
            />
            <InputDropdown
                options={props.options}
                onChange={props.filter.setSearchKey}
                toggleLabel="All"
                wrapperClassName="!min-h-full !max-h-full !flex !flex-col !justify-center"
                boxClassName="!min-h-min !h-min !max-h-min"
                toggleClassName="box-content !min-h-[18px] !max-h-[18px] !h-[18px] p-1 pl-2 pr-1 !gap-x-2 !bg-neutral-800/50 !border-neutral-800 !border-l-0 !rounded-r-md !rounded-l-none shadow-sm"
                toggleLabelClassName="!text-xs !tracking-wide  whitespace-nowrap"
            />
        </div>
    )
}