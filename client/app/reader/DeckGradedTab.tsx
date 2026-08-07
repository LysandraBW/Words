import { Option } from "@/components/input/InputDropdown";
import useFilterObjects from "@/hooks/useFilterObject";
import { DeckType } from "@/services/server/deck";
import { DeckGradedType } from "@/services/server/deckGraded";
import ActionBar from "../../components/ui/table/ActionBar";
import TableHead from "../../components/ui/table/TableHead";
import TableBody from "../../components/ui/table/TableBody";
import NavigationBar from "../../components/ui/table/Navigation";
import { useState } from "react";


interface DeckGradedTabProps {
    deck: DeckType;
    decksGraded: DeckGradedType[];
    onDelete: (deckGradedIDs: number[]) => void;
    onClickObjectRow: (deckGraded: DeckGradedType) => void;
}


export default function DeckGradedTab(props: DeckGradedTabProps) {
    const [display, setDisplay] = useState("List");
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const filter = useFilterObjects({ 
        objects: props.decksGraded
    });

    const searchOptions: Option<string>[] = [];
    const sortOptions: Option<string>[] = [
        {
            value: "deck_duration",
            textLabel: "Duration"
        },
        {
            value: "number_correct",
            textLabel: "Number Correct"
        },
        {
            value: "number_incorrect",
            textLabel: "Number Incorrect"
        }
    ];


    const toggleAllCheckboxes = () => {
        if (selected.size === 0) {
            const deckIDs = props.decksGraded.map(deck => deck.deck_graded_id);
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
                onDelete={() => props.onDelete([...selected])}
                onDisplayChange={setDisplay}
            />
            <div>
                <div
                    className="grid bg-neutral-900 border border-neutral-800 border-b-0 rounded-t-lg overflow-clip"
                    style={{
                        "gridTemplateColumns": `calc(26px + 16px) 1fr 1fr 1fr`
                    }}
                >
                    <TableHead
                        columns={["Duration", "Number Correct", "Number Incorrect"]}
                        allSelected={selected.size === props.decksGraded.length && !!props.decksGraded.length}
                        onToggleAllCheckboxes={toggleAllCheckboxes}
                    />
                    <TableBody
                        objectID={"deck_graded_id"}
                        objects={filter.filteredObjects}
                        onSelectObject={selectObject}
                        onDeselectObject={deselectObject}
                        selectedObjects={selected}
                        keys={["Duration", "number_correct", "number_incorrect"]}
                        getElementCallback={(key, deck_graded) => {
                            if (key === "Duration") {
                                return (
                                    <p className="w-full text-sm text-center- tracking-wide text-neutral-400">
                                        {deck_graded.duration}ms
                                    </p>
                                )
                            }
                            return <></>;
                        }}
                        onClickObjectRow={props.onClickObjectRow}
                    />
                </div>
                <NavigationBar
                    filter={filter}
                />
            </div>
        </>
    )
}