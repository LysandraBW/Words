import { NullableBy } from "./types";
import { WordType } from "./word";


export type DeckQuestionType = {
    type: string | null;
    words: [string, string][];
};


export interface DeckType {
    deck_id: number;
    deck_name: string;
    deck_words: number[];
    deck_questions: DeckQuestionType[];
    reader_id: string;
}


export type CreateDeckType = Pick<
    DeckType, 
    "deck_name" | "deck_words"
>;


export type UpdateDeckType = Pick<DeckType, "deck_id"> & NullableBy<Pick<DeckType, "deck_name" | "deck_words">, "deck_name" | "deck_words">;


export async function insertDeck(deck: CreateDeckType) {
    const response = await fetch('http://127.0.0.1:8000/decks', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deck)
    });

    if (response.status !== 200)
        throw new Error(`Failed to Insert Deck (${response.status})`);

    const data: DeckType | null = await response.json();
    if (!data)
        throw new Error('Failed to Insert Deck');

    return data;
}


export async function updateDeck(deck: UpdateDeckType) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deck.deck_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deck)
    });

    if (response.status !== 200)
        throw new Error(`Failed to Update Deck (${response.status})`);

    const data: DeckType | null = await response.json();
    console.log(data);
    if (!data)
        throw new Error('Failed to Update Deck');

    return data;
}


export async function deleteDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Delete Deck (${response.status})`);

    const data: DeckType | null = await response.json();
    if (!data)
        throw new Error('Failed to Delete Deck');

    return data;
}


export async function selectDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Select Deck (${response.status})`);

    const data: DeckType | null = await response.json();
    if (!data)
        throw new Error('Failed to Select Deck');

    return data;
}


export async function reloadDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}/reload`, {
        method: "PUT",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Reload Deck (${response.status})`);

    const data: DeckType | null = await response.json();
    if (!data)
        throw new Error('Failed to Reload Deck');

    return data;
}


export async function selectDecks() {
    const response = await fetch('http://127.0.0.1:8000/decks', {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Select Decks (${response.status})`);

    const data: DeckType[] | null = await response.json();
    if (!data)
        throw new Error('Failed to Select Decks');

    return data;
}


export async function selectDecksByBook(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/decks`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Select Decks by Book (${response.status})`);

    const data: DeckType | null = await response.json();
    if (!data)
        throw new Error('Failed to Select Decks by Book');

    return data;
}


export async function selectDecksByChapter(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}/decks`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Select Decks by Chapter (${response.status})`);

    const data: DeckType | null = await response.json();
    if (!data)
        throw new Error('Failed to Select Decks by Chapter');

    return data;
}


export async function selectDeckWords(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${chapterID}/words`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        throw new Error(`Failed to Select Deck's Words (${response.status})`);

    const data: WordType[] | null = await response.json();
    if (!data)
        throw new Error('Failed to Select Deck\'s Words');
    
    return data;
}