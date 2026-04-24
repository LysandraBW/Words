"use server";

export type Meaning = {
    synonyms: string[];
    antonyms: string[];
    partOfSpeech: string;
    definitions: Array<{
        key: number;
        synonyms: string[];
        antonyms: string[];
        definition: string;
        example: string;
    }>;
    phonetic: string;
}
 
export type Word = Array<{
    license: {
        name: string;
        url: string;
    };
    meanings: Array<Meaning>;
    phonetics: Array<{
        text: string;
        audio: string;
    }>;
    word: string;
}>

export default async function getWord(word: string): Promise<Word> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(url);
    const data: Word = await response.json();

    // Add Keys for Indexing
    let key = 0;
    for (const word of data) {
        for (const meaning of word.meanings) {
            for (const definition of meaning.definitions) {
                definition.key = key;
                key += 1;
            }
        }
    }

    return data;
}