import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";
import CreateButton from "./CreateButton";
import DeleteButton from "./DeleteButton";
import DisplayButton from "./DisplayButton";
import Sort from "./Sort";
import Search from "./Search";


interface ActionBarProps {
    onCreate?: null | (() => void);
    onDelete?: null | (() => void);
    display: string;
    onDisplayChange: (display: string) => void;
    sortOptions: Option<string>[];
    searchOptions: Option<string>[];
    filter: ReturnType<typeof useFilterObjects>;
}

export default function ActionBar(props: ActionBarProps) {
    
    return (
        <div 
            className="h-fit p-2 grid grid-rows-1 grid-cols-[min-content_min-content_1fr_min-content] gap-x-2 items-center bg-neutral-900 border border-neutral-800 rounded-lg"
            style={{
                gridTemplateColumns: !props.onCreate && props.onDelete ? "min-content 1fr min-content" : props.onCreate && !props.onDelete ? "min-content 1fr min-content" : !props.onDelete && !props.onCreate ? "1fr min-content" : "min-content min-content 1fr min-content"
            }}
        >
            {props.onCreate &&
                <CreateButton
                    onClick={props.onCreate}
                />
            }
            {props.onDelete &&
                <DeleteButton
                    onClick={props.onDelete}
                />
            }
            <Search
                options={props.searchOptions}
                filter={props.filter}
            />
            <Sort
                options={props.sortOptions}
                filter={props.filter}
            />
        </div>
    )
}