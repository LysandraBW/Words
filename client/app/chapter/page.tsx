"use client";
import InputText from "@/components/input/InputText";
import getAutoCompletion from "@/services/words/getAutoCompletion";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import getWord, { Word } from "@/services/words/getWord";
import Sense from "./Sense";
import Inflection from "./Inflections";

export default function Page() {
    const [chapter, setChapter] = useState<any>({
        name: "Chapter Name",
        words: []
    });

    // Add Word
    const [w, setW] = useState("thou");
    const [word, setWord] = useState<any>();
    const [showLogWord, setShowLogWord] = useState(false);

    const [search, setSearch] = useState("");
    const [searchDebounced] = useDebounce(search, 500);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    
    useEffect(() => {
        const chapter_id = 0;
        loadChapter(chapter_id);
    }, []);

    useEffect(() => {
        autoCompleteSearch(searchDebounced);
    }, [searchDebounced]);

    const loadChapter = async (chapter_id: number) => {
        // const cat = await getWord("cat");
        // const dog = await getWord("dog");

        // setChapter();

        // const word = "set";
        const key = process.env.NEXT_PUBLIC_MERRIAM_WEBSTER_API_KEY_DICTIONARY;
        console.log(key);

        let url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
        url += `${w}?`;
        url += `key=${key}`
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setWord(data);
    }

    const updateWord = async (search: string) => {
        const word = await getWord(search);
        setWord(word);
    }

    const onInsertWord = async (wordKey: number) => {
        setShowLogWord(false);
        return;
    }

    const onDeleteWord = async () => {
        return;
    }

    const autoCompleteSearch = (search: string) => {
        const suggestions = getAutoCompletion(search, 5);
        setSearchSuggestions(suggestions);
    }

    return (
        <div>

            {/* <button
                onClick={() => setShowLogWord(true)}
            >
                Add Meaning
            </button> */}
            {word && word.filter((entry: any) => entry.def).filter((entry: any) => entry.meta.id.split(":")[0] === w).map((entry: any, i: number) => (
                <div 
                    key={i}
                    className="mb-10 flex flex-col bg-gray-50"
                >
                    <b>
                        {entry.meta.id.split(":")[0]}
                    </b>
                    {entry.fl}
                    {entry.ins &&
                        <Inflection
                            ins={entry.ins}
                        />
                    }
                    {entry.def.map((def: any, j: number) => (
                        <div 
                            key={j}
                            className="pl-4 flex flex-col gap-y-4 bg-gray-50"
                        >
                            {def.vd && def.vd}
                            {def.sls && def.sls.map((label: string, i: number) => (
                                <span key={i}>
                                    {label}
                                </span>
                            ))}
                            {def.sseq.map((seq: any, k: number) => (
                                <div 
                                    key={k}
                                    className="pl-4 flex flex-col gap-y-1 bg-gray-50"
                                >
                                    {seq.map((sense: any, x: number) => (
                                        <>
                                            {
                                                ["sense", "sen"].includes(sense[0]) ?
                                                    <div key={x}>
                                                        <div>
                                                            <div className="flex">
                                                                <span className="block w-10 text-right">
                                                                    {sense[1]["sn"]}
                                                                </span>
                                                                <span className="block">
                                                                    <Sense
                                                                        senseType={sense[0]}
                                                                        senseData={sense[1]}
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                :
                                                    <div>
                                                        
                                                    </div>
                                            }
                                            {sense[0] === "pseq" &&
                                                <>
                                                    {sense[1].map((partialSense: any, y: number) => (
                                                        <div key={y}>
                                                            <div>
                                                                <div className="flex">
                                                                    <span className="block w-10 text-right">
                                                                        {partialSense[1]["sn"]}
                                                                    </span>
                                                                    <span className="block">
                                                                        <Sense
                                                                            senseType={partialSense[0]}
                                                                            senseData={partialSense[1]}
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            }
                                        </>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            
            {showLogWord &&
                <div 
                    className="bg-green-500"
                >
                    <div
                        onClick={() => setShowLogWord(false)}
                    >
                        Close
                    </div>
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
                                updateWord(value);
                            }}
                        >
                            {value}
                        </div>
                    ))}
                    {/* {word?.map((definition, k) => (
                        <div
                            key={k}
                            className="flex flex-col gap-y-8"
                        >
                            Definition {k+1}
                            {definition?.meanings.map((meaning, i) => (
                                <div
                                    key={i}
                                    className="mb-4 bg-red-500"
                                >
                                    {meaning.phonetic}
                                    {meaning.partOfSpeech}
                                    {meaning.antonyms.map((a, aIndex) => (
                                        <p key={aIndex}>
                                            {a}
                                        </p>
                                    ))}
                                    {meaning.synonyms.map((s, sIndex) => (
                                        <p key={sIndex}>
                                            {s}
                                        </p>
                                    ))}
                                    {meaning.definitions.map((definition, j) => (
                                        <div
                                            key={j}
                                            className="mb-2 bg-blue-500"
                                        >
                                            {definition.definition}
                                            {definition.example}
                                            {definition.antonyms}
                                            {definition.synonyms}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))} */}
                </div>
            }
        </div>
    )
}