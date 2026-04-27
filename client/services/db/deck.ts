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


export interface DeckGradedType {
    deck_graded_id: number;
    duration: number;
    number_correct: number;
    number_incorrect: number;
    deck_id: number;
}


export interface DeckCardGradedType {
    choice: number;
    deck_graded_id: number;
    deck_card_id: number;
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

    const data: [DeckType[], DeckCardType[]] = await response.json();
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

    const data: [DeckType[], DeckCardType[]] | [DeckType[]] = await response.json();
    return data;
}


export async function getDecks() {
    const response = await fetch('http://127.0.0.1:8000/decks', {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] = await response.json();
    return data;
}


export async function getDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: [DeckType[], DeckCardType[]] = await response.json();
    return data;
}


export async function getDeckCards(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] = await response.json();
    return data;
}


export async function deleteDeck(deckID: number) {
    const response = await fetch(`http://127.0.0.1:8000/decks/${deckID}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: DeckType[] = await response.json();
    return data;
}

export async function createGradedDeck(deck: DeckGradedType, choices: [number, number][]) {
    const response = await fetch('http://127.0.0.1:8000/decks/graded', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...deck, choices})
    });

    if (response.status !== 200)
        return null;

    const data: [DeckGradedType[], DeckCardGradedType[]] = await response.json();
    return data;
}