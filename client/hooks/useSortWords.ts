import { WordType } from "@/services/server/word";
import { WordData } from "@/utilities/wordData";
import { useEffect, useState } from "react";


export const DESCENDING = 2;
export const ASCENDING = 1;


export default function useSortWords(words: WordType[] | undefined | null, wordsData?: {[word: string]: WordData} | undefined | null) {
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');

    const [direction, setDirection] = useState<number>(ASCENDING);
    const [sortedWords, setSortedWords] = useState<WordType[]>();

    const sortOptions = !wordsData ? [
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
    ] : [
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
    ]
    

    const sortWords = (sort: string, direction: number, words: WordType[], wordsData: {[word: string]: WordData} | undefined | null): WordType[] => {
        let sortedWords: WordType[] = [];

        if (sort === 'seen') {
            sortedWords = words.toSorted((a: WordType, b: WordType) => new Date(a.last_seen).getTime() - new Date(b.last_seen).getTime());
        }
        else if (sort === 'count') {
            sortedWords = words.toSorted((a: WordType, b: WordType) => a.word_number_instances - b.word_number_instances);
        }
        else if (sort === 'added') {
            sortedWords = words.toSorted((a: WordType, b: WordType) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
        else if (sort === 'accuracy' && wordsData) {
            sortedWords = words.toSorted((a: WordType, b: WordType) => wordsData[a.word[0]].accuracy - wordsData[b.word[0]].accuracy);
        }
        else {
            return words;
        }

        if (direction === DESCENDING)
            return sortedWords.reverse();
        return sortedWords;
    }


    const searchWords = (search: string, words: WordType[]): WordType[] => {
        const searchLower = search.toLowerCase();
        return words.filter(w => w.word[0].toLowerCase().includes(searchLower)).sort((a, b) => {
            const aStarts = a.word[0].toLowerCase().startsWith(searchLower);
            const bStarts = b.word[0].toLowerCase().startsWith(searchLower);

            if (aStarts && !bStarts) 
                return -1;
            if (!aStarts && bStarts) 
                return 1;
            return a.word[0].localeCompare(b.word[0]);
        });
    }


    const nextDirection = (direction: number) => {
        const next = direction + 1;
        if (next >= 3)
            return 0;
        return next;
        
    }


    useEffect(() => {
        if (!words)
            return;
        const searchedWords = searchWords(search, words);
        const sortedWords = sortWords(sort, direction, searchedWords, wordsData);
        setSortedWords(sortedWords);
    }, [sort, search, direction, words, wordsData]);


    return {
        sort,
        setSort,
        sortedWords,
        sortOptions,
        search,
        setSearch,
        direction,
        setDirection,
        nextDirection
    }
}