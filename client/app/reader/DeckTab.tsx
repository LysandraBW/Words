import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";
import { DeckType } from "@/services/server/deck";
import { DeckGradedType } from "@/services/server/deckGraded";
import ActionBar from "./home/ActionBar/ActionBar";
import TableHead from "./home/TableHead";
import TableBody from "./home/TableBody";
import NavigationBar from "./home/Navigation";


interface DeckTabProps {
    decks: DeckType[];
    decksGraded: DeckGradedType[];
    onCreate: () => void;
}


export default function DeckTab(props: DeckTabProps) {
    const filter = useFilterObjects({ 
        objects: props.decks
    });

    
    const searchOptions: Option<string>[] = [
        {
            value: "deck_name",
            textLabel: "Name"
        }
    ];


    const sortOptions: Option<string>[] = [
        {
            value: "deck_name",
            textLabel: "Name"
        }
    ];


    return (
        <>
            <ActionBar
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                filter={filter}
                onCreate={props.onCreate}
            />
            <div>
                <div
                    className="grid bg-neutral-900 border border-neutral-800 border-b-0 rounded-t-lg overflow-clip"
                    style={{
                        "gridTemplateColumns": `calc(26px + 16px) 1fr`
                    }}
                >
                    <TableHead
                        columns={["Name"]}
                    />
                    <TableBody
                        objects={filter.filteredObjects}
                        objectID={"deck_id"}
                        keys={["deck_name"]}
                    />
                </div>
                <NavigationBar
                    filter={filter}
                />
            </div>
        </>
    )
}