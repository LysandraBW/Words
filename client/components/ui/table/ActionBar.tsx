import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";
import CreateButton from "./CreateButton";
import DeleteButton from "./DeleteButton";
import DisplayButton from "./DisplayButton";
import Sort from "./Sort";
import Search from "./Search";


interface ActionBarProps {
    onCreate: () => void;
    onDelete: () => void;
    display: string;
    onDisplayChange: (display: string) => void;
    sortOptions: Option<string>[];
    searchOptions: Option<string>[];
    filter: ReturnType<typeof useFilterObjects>;
}

export default function ActionBar(props: ActionBarProps) {
    
    return (
        <div className="h-fit p-2 grid grid-rows-1 grid-cols-[min-content_min-content_1fr_min-content] gap-x-2 items-center bg-neutral-900 border border-neutral-800 rounded-lg">
            <CreateButton
                onClick={props.onCreate}
            />
            <DeleteButton
                onClick={props.onDelete}
            />
            <Search
                options={props.searchOptions}
                filter={props.filter}
            />
            <Sort
                options={props.sortOptions}
                filter={props.filter}
            />
            {/* <DisplayButton
                display={props.display}
                onClickDisplay={props.onDisplayChange}
            /> */}
        </div>
    )
}