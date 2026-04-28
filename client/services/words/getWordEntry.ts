"use server";

const key = process.env.NEXT_PUBLIC_MERRIAM_WEBSTER_API_KEY_DICTIONARY;

export default async function getWordEntry(word: string): Promise<any> {
    let url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
    url += `${word}?`;
    url += `key=${key}`;

    const response = await fetch(url);
    const data = await response.json();
    
    return data;
}