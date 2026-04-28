import { NullableBy } from "./types";

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


export async function createDeck(deck: DeckType) {
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


export async function getDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: {deck: DeckType, deckCards: (DeckType & DeckCardType)[]} | null = await response.json();
    return data;
}


export async function updateDeck(deck: NullableBy<DeckType, 'deck_chapters'>) {
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


export async function getDecks() {
    const response = await fetch('http://127.0.0.1:8000/decks', {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] | null = await response.json();
    return data;
}


export async function getDecksByBooks(bookIDs: number[]) {
    const response = await fetch(`http://127.0.0.1:8000/decks/byBooks`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({bookIDs})
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] | null = await response.json();
    return data;
}


export async function getDecksByChapters(chapterIDs: number[]) {
    const response = await fetch(`http://127.0.0.1:8000/decks/byChapters`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({chapterIDs})
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] | null = await response.json();
    return data;
}