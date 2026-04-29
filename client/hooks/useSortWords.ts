import { WordType } from "@/services/server/word";
import { useEffect, useState } from "react";

export default function useSortWords(words: WordType[] | undefined | null, wordAccuracies?: {[word: string]: number} | undefined | null) {
    const [sort, setSort] = useState('');
    const [sortedWords, setSortedWords] = useState<WordType[]>();

    const sortOptions = wordAccuracies ? [
        {
            value: 'count',
            textLabel: 'Count'
        },
        {
            value: 'oldest',
            textLabel: 'Oldest'
        },
        {
            value: 'newest',
            textLabel: 'Newest'
        },
        {
            value: 'seen',
            textLabel: 'Seen'
        },
        {
            value: 'bad',
            textLabel: 'Bad'
        },
        {
            value: 'good',
            textLabel: 'Good'
        }
    ] : [
        {
            value: 'count',
            textLabel: 'Count'
        },
        {
            value: 'oldest',
            textLabel: 'Oldest'
        },
        {
            value: 'newest',
            textLabel: 'Newest'
        },
        {
            value: 'seen',
            textLabel: 'Seen'
        }
    ];

    const sortWords = (sort: string, words: WordType[], wordAccuracies: {[word: string]: number} | undefined | null): WordType[] => {
        if (!sort || sort === 'seen') {
            return words.toSorted((a: WordType, b: WordType) => new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime());
        }
        else if (sort === 'count') {
            return words.toSorted((a: WordType, b: WordType) => b.word_number_instances - a.word_number_instances);
        }
        else if (sort === 'oldest') {
            return words.toSorted((a: WordType, b: WordType) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
        else if (sort === 'newest') {
            return words.toSorted((a: WordType, b: WordType) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        else if (sort === 'bad' && wordAccuracies) {
            return words.toSorted((a: WordType, b: WordType) => wordAccuracies[a.word[0]] - wordAccuracies[b.word[0]]);
        }
        else if (sort === 'good' && wordAccuracies) {
            return words.toSorted((a: WordType, b: WordType) => wordAccuracies[b.word[0]] - wordAccuracies[a.word[0]]);
        }
        return words;
    }

    useEffect(() => {
        if (!words)
            return;
        setSortedWords(sortWords(sort, words, wordAccuracies));
    }, [words, wordAccuracies, sort]);

    return {
        sort,
        setSort,
        sortedWords,
        sortOptions
    }
}