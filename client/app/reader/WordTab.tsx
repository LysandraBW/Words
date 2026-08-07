import useFilterObjects from "@/hooks/useFilterObject";
import { DeckGradedType } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import { Entry } from "@/services/words/getWordEntry";
import getWordData, { WordData } from "@/utilities/wordData";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ActionBar from "../../components/ui/table/ActionBar";
import TableHead from "../../components/ui/table/TableHead";
import TableBody from "../../components/ui/table/TableBody";
import NavigationBar from "../../components/ui/table/Navigation";
import { MinusIcon, PlusIcon } from "lucide-react";


interface WordTabProps {
    words: WordType[];
    decksGraded: DeckGradedType[];
    lookup: {[word: string]: {entries: Entry[], z: number}}|null;
    setLookup: Dispatch<SetStateAction<{
        [word: string]: {
            entries: Entry[];
            z: number;
        };
    } | null | undefined>>;
    onOpenWord: (word: string) => void;
    onCloseWord: (word: string) => void;
    onBringWordToFront: (word: string) => void;
    onCreate?: () => void;
    onDelete?: (wordIDs: number[]) => void;
    onIncrement?: (wordID: number) => void;
    onDecrement?: (wordID: number) => void;
}

export default function WordTab(props: WordTabProps) {
    const [augmentedWords, setAugmentedWords] = useState<(WordType & WordData)[]>([]);
    
    const [display, setDisplay] = useState("List");
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const filter = useFilterObjects({
        objects: augmentedWords.sort((a, b) => {
            return (new Date(a.created_at)).getTime() - (new Date(b.created_at)).getTime();
        }),
        getObjectValueCallback: (key, word) => {
            if (key === "word") {
                return word.word[0];
            }
            if (key === "def") {
                return word.word[1];
            }
            if (key === "all") {
                return word.word[0] + " " + word.word[1];
            }
            return "";
        }
    });

    const searchOptions = [
        {
            value: 'all',
            textLabel: 'All'
        },
        {
            value: 'word',
            textLabel: 'Word'
        },
        {
            value: 'def',
            textLabel: 'Definition'
        }
    ];

    const sortOptions = [
        {
            value: 'count',
            textLabel: 'Count'
        },
        {
            value: 'added',
            textLabel: 'Added'
        },
        {
            value: 'word_number_instances',
            textLabel: 'Seen'
        },
        {
            value: 'accuracy',
            textLabel: 'Accuracy'
        }
    ];


    const toggleAllCheckboxes = () => {
        // All Selected
        if (selected.size === 0) {
            const ids = props.words.map(word => word.word_id);
            setSelected(new Set(ids));
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


    useEffect(() => {
        const load = async () => {
            const augmentedWords = [];
            const wordsData = await getWordData(props.decksGraded, props.words.map(word => word.word[0]));
            for (const [word, wordData] of Object.entries(wordsData)) {
                const wordObjects = props.words.filter(w => w.word[0] === word);
                for (const wordObject of wordObjects) {
                    augmentedWords.push({
                        ...wordObject,
                        ...wordData
                    });
                }
            }
            setAugmentedWords(augmentedWords);
            filter.setSearchKey('all');
        }
        load();
    }, [props.words, props.decksGraded.length]);


    useEffect(() => {
        console.log(props.words);
    }, [props.words]);


    return (
        <>
            <ActionBar
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                filter={filter}
                display={display}
                onCreate={props.onCreate}
                onDelete={props.onDelete ? (() => {
                    if (!props.onDelete)
                        return;
                    props.onDelete([...selected])
                }) : null}
                onDisplayChange={setDisplay}
            />
            <div>
                <div
                    className="grid bg-neutral-900 border border-neutral-800 border-b-0 rounded-t-lg overflow-clip"
                    style={{
                        "gridTemplateColumns": `calc(26px + 16px) auto 5fr auto auto auto auto`
                    }}
                >
                    <TableHead
                        columns={["Term", "Meaning", "Created", "Last Seen", "Seen", "Accuracy"]}
                        allSelected={selected.size === props.words.length && !!props.words.length}
                        onToggleAllCheckboxes={toggleAllCheckboxes}
                    />
                    <TableBody
                        objectID={"word_id"}
                        objects={filter.filteredObjects}
                        onSelectObject={selectObject}
                        onDeselectObject={deselectObject}
                        selectedObjects={selected}
                        keys={["Word", "Definition", "Created", "Last Seen", "Seen", "Acc"]}
                        getElementCallback={(key, word) => {
                            if (key === "Word") {
                                return (
                                    <p className="w-full text-sm text-center- tracking-wide text-neutral-400">
                                        {word.word[0]}
                                    </p>
                                )
                            }
                            if (key === "Definition") {
                                return (
                                    <p className="text-sm tracking-wide text-neutral-400 whitespace-nowrap text-ellipsis">
                                        {word.word[1]
                                    }</p>
                                )
                            }
                            if (key === "Created") {
                                return (
                                    <p className="text-sm tracking-wide text-neutral-400">
                                        {word.created_at ? new Date(word.created_at).toLocaleDateString() : ""}
                                    </p>
                                )
                            }
                            if (key === "Last Seen") {
                                return (
                                    <p className="text-sm tracking-wide text-neutral-400">
                                        {word.last_seen ? new Date(word.created_at).toLocaleDateString() : ""}
                                    </p>
                                )
                            }
                            if (key === "Seen") {
                                return (
                                    <div className="w-full grid grid-cols-3 gap-x-4">
                                        {(props.onIncrement && props.onDecrement) &&
                                            <button 
                                                onClick={() => props.onDecrement && props.onDecrement(word.word_id)}
                                                className="p-0.5 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm"
                                            >
                                                <MinusIcon
                                                    size={14}
                                                    className="stroke-neutral-500 scale-x-70"
                                                />
                                            </button>
                                        }
                                        <p className="text-sm tracking-wide text-center text-neutral-400">
                                            {word.word_number_instances}x
                                        </p>
                                        {(props.onIncrement && props.onDecrement) && 
                                            <button 
                                                onClick={() => props.onIncrement && props.onIncrement(word.word_id)}
                                                className="p-0.5 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm"
                                            >
                                                <PlusIcon
                                                    size={14}
                                                    className="stroke-neutral-500 scale-x-95"
                                                />
                                            </button>
                                        }
                                    </div>
                                )
                            }
                            if (key === "Acc") {
                                return (
                                    <p className="text-sm tracking-wide text-neutral-400">
                                        {Number(word.accuracy*100).toPrecision(2)}%
                                    </p>
                                )
                            }
                            return <></>;
                        }}
                    />
                </div>
                <NavigationBar
                    filter={filter}
                />
            </div>
        </>
    )
}