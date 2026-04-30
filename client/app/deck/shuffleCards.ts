import { DeckType } from "@/services/server/deck";
import { DeckGradedType } from "@/services/server/deckGraded";

export type DeckExtendedType = Omit<DeckType | DeckGradedType, "deck_questions">  & {
    // We add a number in order to keep
    // track of the numbering as we shuffle
    // the words.
    deck_questions: (Omit<(DeckType | DeckGradedType)["deck_questions"][number], "words"> & {
        words: [string, string, number][]
    })[];
}


export function shuffleCards(deck: DeckType | DeckGradedType): DeckExtendedType {
    const questionsExtended: DeckExtendedType["deck_questions"] = [];

    for (const question of deck.deck_questions) {
        const shuffledIndices = [...Array(question.words.length)].map((e, i) => i);
        shuffledIndices.sort(() => Math.random() - 0.5);

        const shuffledWords: DeckExtendedType["deck_questions"][number]["words"] = [];
        for (let i = 0; i < question.words.length; i++) {
            const shuffledIndex = shuffledIndices[i];
            shuffledWords.push([
                question.words[shuffledIndex][0], 
                question.words[shuffledIndex][1], 
                shuffledIndex
            ]);
        }

        questionsExtended.push({
            ...question,
            words: shuffledWords
        });
    }

    return {
        ...deck,
        deck_questions: questionsExtended
    };
}