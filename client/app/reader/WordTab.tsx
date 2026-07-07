import useFilterObjects from "@/hooks/useFilterObject";
import { DeckGradedType } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import { Entry } from "@/services/words/getWordEntry";
import getWordData, { WordData } from "@/utilities/wordData";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ActionBar from "./home/ActionBar/ActionBar";
import TableHead from "./home/TableHead";
import TableBody from "./home/TableBody";
import NavigationBar from "./home/Navigation";


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
}

export default function WordTab(props: WordTabProps) {
    const [augmentedWords, setAugmentedWords] = useState<(WordType & WordData)[]>([]);
    
    const filter = useFilterObjects({
        objects: augmentedWords,
        getObjectValueCallback: (key, word) => {
            if (key === "word") {
                return word.word[0];
            }
            if (key === "def") {
                return word.word[1];
            }
            return "";
        }
    });

    const searchOptions = [
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
            value: 'seen',
            textLabel: 'Seen'
        },
        {
            value: 'accuracy',
            textLabel: 'Accuracy'
        }
    ];

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
        }
        load();
    }, [props.words.length, props.decksGraded.length]);

    return (
        <>
            <ActionBar
                searchOptions={searchOptions}
                sortOptions={sortOptions}
                filter={filter}
            />
            <TableHead
                columns={["Word", "Definition", "Date Created", "Date Last Seen", "Number Instances", "Accuracy"]}
            />
            <TableBody
                objects={filter.filteredObjects}
                objectID={"word_id"}
                keys={["Word", "Definition", "created_at", "last_seen", "word_number_instances", "accuracy"]}
                getElementCallback={(key, word) => {
                    if (key === "Word") {
                        return (
                            <p className="text-xs tracking-wide">{word.word[0]}</p>
                        )
                    }
                    if (key === "Definition") {
                        return (
                            <p className="text-xs tracking-wide">{word.word[1]}</p>
                        )
                    }
                    return <></>;
                }}
            />
            <NavigationBar
                filter={filter}
            />
        </>
    )
}