import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";
import { DeckType } from "@/services/server/deck";
import { DeckGradedType } from "@/services/server/deckGraded";
import ActionBar from "../../components/ui/table/ActionBar";
import TableHead from "../../components/ui/table/TableHead";
import TableBody from "../../components/ui/table/TableBody";
import NavigationBar from "../../components/ui/table/Navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface DeckTabProps {
    decks: DeckType[];
    decksGraded: DeckGradedType[];
    onCreate: () => void;
    onDelete: (deckIDs: number[]) => void;
}


export default function DeckTab(props: DeckTabProps) {
    const router = useRouter();

    const [display, setDisplay] = useState("List");
    const [selected, setSelected] = useState<Set<number>>(new Set());


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


    const toggleAllCheckboxes = () => {
        // All Selected
        if (selected.size === 0) {
            const deckIDs = props.decks.map(deck => deck.deck_id);
            setSelected(new Set(deckIDs));
        }
        else {
            setSelected(new Set());
        }
    }


    const selectObject = (objectID: number) => {
        const updatedSelectedBooks = new Set(selected);
        updatedSelectedBooks.add(objectID);
        setSelected(updatedSelectedBooks);
    }


    const deselectObject = (objectID: number) => {
        const updatedSelectedBooks = new Set(selected);
        updatedSelectedBooks.delete(objectID);
        setSelected(updatedSelectedBooks);
    }


    return (
        <>
            <ActionBar
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                filter={filter}
                display={display}
                onCreate={props.onCreate}
                onDelete={() => props.onDelete([...selected])}
                onDisplayChange={setDisplay}
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
                        allSelected={selected.size === props.decks.length && !!props.decks.length}
                        onToggleAllCheckboxes={toggleAllCheckboxes}
                    />
                    <TableBody
                        objectID={"deck_id"}
                        onClickObjectRow={(deck: DeckType) => router.push(`/reader/deck?deckID=${deck.deck_id}`)}
                        objects={filter.filteredObjects}
                        onSelectObject={selectObject}
                        onDeselectObject={deselectObject}
                        selectedObjects={selected}
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