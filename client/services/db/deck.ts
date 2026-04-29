import { WordType } from "./word";

export interface DeckType {
    deck_id: number;
    deck_name: string;
    deck_chapters: number[];
    reader_id: string;
}


export interface DeckCardType {
    deck_card_id: number;
    deck_id: number;
    words: [string, string][];
}


export type CreateDeckType = Pick<
    DeckType, 
    "deck_name" | "deck_chapters"
>;


export type UpdateDeckType = Pick<
    DeckType, 
    "deck_id" | "deck_name" | "deck_chapters"
>;


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
        return null;

    const data: {deck: DeckType, deckCards: DeckCardType[]} | null = await response.json();
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
        return null;

    const data: {deck: DeckType, deckCards?: DeckCardType[]} | null = await response.json();
    return data;
}


export async function deleteDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType | null = await response.json();
    return data;
}


export async function selectDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: {deck: DeckType, deckCards: (DeckType & DeckCardType)[]} | null = await response.json();
    return data;
}


export async function reloadDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}/reload`, {
        method: "PUT",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckCardType[] | null = await response.json();
    return data;
}


export async function selectDecks() {
    const response = await fetch('http://127.0.0.1:8000/decks', {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] | null = await response.json();
    return data;
}


export async function selectDecksByBook(bookID: number) {
    const response = await fetch(`http://127.0.0.1:8000/books/${bookID}/decks`, {
        method: "POST",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] | null = await response.json();
    return data;
}


export async function selectDecksByChapters(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/chapters/${chapterID}/decks`, {
        method: "POST",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] | null = await response.json();
    return data;
}


export async function selectDeckWords(chapterID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${chapterID}/words`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType[] | null = await response.json();
    return data;
}