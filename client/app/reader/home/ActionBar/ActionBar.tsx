import InputCheckbox from "@/components/input/InputCheckbox/InputCheckbox";
import DeleteButton, { DeleteButtonProps } from "./DeleteButton";
import DisplayButton, { DisplayButtonProps } from "./DisplayButton";
import Search, { SearchProps } from "./Search";
import Sort, { SortProps } from "./Sort";
import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";
import CreateButton from "./CreateButton";


interface ActionBarProps extends DeleteButtonProps, DisplayButtonProps {
    sortOptions: Option<string>[];
    searchOptions: Option<string>[];
    filter: ReturnType<typeof useFilterObjects>;
    onCreate: () => void;
}

export default function ActionBar(props: ActionBarProps) {
    
    return (
        <div className="h-fit p-2 mb-2 grid grid-rows-1 grid-cols-[min-content_min-content_1fr_min-content_min-content] gap-x-2 items-center bg-neutral-900/50 border border-neutral-800 rounded-xl">
            <CreateButton
                onClick={props.onCreate}
            />
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