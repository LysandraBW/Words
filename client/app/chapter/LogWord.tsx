import InputText from "@/components/input/InputText";
import Word from "@/app/chapter/Word";
import WordNotFound from "@/app/chapter/WordNotFound";
import getAutoCompletion from "@/services/words/getAutoCompletion";
import getWordEntry from "@/services/words/getWordEntry";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";


interface LogWordProps {
    onClose: () => void;
    onCreateWord: (word: string, wordDefinition: string) => void;
}


export default function LogWord(props: LogWordProps) {
    const [word, setWord] = useState<string>();
    const [wordEntry, setWordEntry] = useState<any>();

    const [search, setSearch] = useState("");
    const [searchDebounced] = useDebounce(search, 500);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);


    useEffect(() => {
        if (!searchDebounced.length)
            return;
        autoCompleteSearch(searchDebounced);
    }, [searchDebounced]);


    const autoCompleteSearch = (search: string) => {
        const suggestions = getAutoCompletion(search, 5);
        setSearchSuggestions(suggestions);
    }


    const onSearchWord = async (word: string) => {
        setWord(word);
        setSearch(word);

        // Get Entry
        const entry = await getWordEntry(word);
        setWordEntry(entry);
    }


    return (
        <div 
            className="bg-green-500"
        >
            <button
                onClick={props.onClose}
            >
                Close
            </button>
            <InputText
                label="Search Word"
                value={search}
                onChange={setSearch}
            />
            {searchSuggestions.map((value, i) => (
                <div
                    key={i}
                    onClick={() => {
                        setSearch(value);
                        onSearchWord(value);
                    }}
                >
                    {value}
                </div>
            ))}
            {(word && wordEntry) && 
                <>
                    {typeof wordEntry[0] === "string" ?
                        <>
                            <WordNotFound
                                word={word}
                                otherWords={wordEntry}
                                onClickWord={onSearchWord}
                            />
                        </>
                        :
                        <>
                            <Word
                                word={word}
                                wordEntries={wordEntry}
                                onInsertWord={props.onCreateWord}
                            />
                        </>
                    }
                </>
            }
        </div>
    )
}