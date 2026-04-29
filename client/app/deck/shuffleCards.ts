import { DeckCardType } from "@/services/server/deck";

export interface DeckCardExtendedType extends Omit<DeckCardType, "words"> {
    // We add a number in order to keep
    // track of the numbering as we shuffle
    // the words.
    words: [string, string, number][];
}


export function shuffleCards(deckCards: DeckCardType[]) {
    const deckCardsExtended = [];

    for (const card of deckCards) {
        const shuffledIndices = [...Array(card.words.length)].map((e, i) => i);
        shuffledIndices.sort(() => Math.random() - 0.5);

        const shuffledWords: [string, string, number][] = [];
        for (let i = 0; i < card.words.length; i++) {
            const shuffledIndex = shuffledIndices[i];
            shuffledWords.push([
                card.words[shuffledIndex][0], 
                card.words[shuffledIndex][1], 
                shuffledIndex
            ]);
        }

        deckCardsExtended.push({
            ...card,
            words: shuffledWords
        });
    }

    return deckCardsExtended;
}