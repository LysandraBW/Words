import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import DeleteButton, { DeleteButtonProps } from "./DeleteButton";
import DisplayButton, { DisplayButtonProps } from "./DisplayButton";
import Search, { SearchProps } from "./Search";
import Sort, { SortProps } from "./Sort";
import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";


interface ActionBarProps extends DeleteButtonProps, DisplayButtonProps {
    sortOptions: Option<string>[];
    searchOptions: Option<string>[];
    filter: ReturnType<typeof useFilterObjects>;
}

export default function ActionBar(props: ActionBarProps) {
    
    return (
        <div className="h-fit px-2 grid grid-rows-1 grid-cols-[min-content_min-content_1fr_min-content_min-content] gap-x-2 items-center bg-neutral-900 border border-neutral-800 rounded-t-lg">
            <div className="w-min py-2 flex justify-center items-center bg-neutral-900 rounded-l-lg">
                <div className="!w-[26px] !h-[26px] flex justify-center items-center !bg-neutral-800- border- !border-neutral-700 !rounded-md shadow-sm-">
                    <InputCheckbox
                        inputClassName="!w-[14px] !h-[14px] rounded-sm !bg-neutral-800 border !border-neutral-600 !shadow-none"
                    />
                </div>
            </div>
            <DeleteButton
            />
            <Search
                options={props.searchOptions}
                filter={props.filter}
            />
            <Sort
                options={props.sortOptions}
                filter={props.filter}
            />
            <DisplayButton
            />
        </div>
    )
}