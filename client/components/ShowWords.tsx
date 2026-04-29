import useSortWords from "@/hooks/useSortWords";
import { DeckGradedType } from "@/services/server/deckGraded";
import { WordType } from "@/services/server/word";
import getWordData, { WordData } from "@/utilities/wordData";
import { Fragment, useEffect, useState } from "react";
import InputDropdown from "./input/InputDropdown";


interface ShowWordsProps {
    words: WordType[];
    decksGraded: DeckGradedType[];
}


export default function ShowWords(props: ShowWordsProps) {
    const [wordsData, setWordsData] = useState<{[word: string]: WordData}>();
    const sortWords = useSortWords(props.words);


    useEffect(() => {
        const load = async () => {
            const wordsData = await getWordData(props.decksGraded, props.words.map(word => word.word[0]));
            setWordsData(wordsData);
        }
        load();
    }, []);


    return (
        <section className="w-full px-4 py-4">
        <h3 className="mb-4 text-lg text-white font-medium tracking-tight">
            Words
        </h3>
        <div className="flex flex-wrap gap-8">
            <InputDropdown
                label="Sort Words"
                options={sortWords.sortOptions}
                value={[sortWords.sort]}
                onChange={(value: string) => sortWords.setSort(value)}
            />
            <div>
                {(sortWords.sortedWords || props.words).map((word, i) => (
                    <Fragment key={i}>
                        <p 
                            className="p-4 text-white bg-pink-500"
                        >
                            {word.word[0]}, {word.word_number_instances}, {word.created_at || 'Null'}, {word.last_seen || 'Null'}, {wordsData ? wordsData[word.word[0]].accuracy : 'Null'}
                        </p>
                    </Fragment>
                ))}
            </div>
        </div>
    </section>
    )
}