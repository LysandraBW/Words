import { selectDeck } from "@/services/server/deck";
import { DeckGradedType, selectDeckGraded } from "@/services/server/deckGraded";


export interface WordData {
    count: number;
    correct: number;
    accuracy: number;
}


export default async function getWordData(decksGraded: DeckGradedType[], wordLiterals?: string[]): Promise<{[word: string]: WordData}> {
    // Initialize
    const words: {[word: string]: WordData} = {};
    if (wordLiterals) {
        for (const wordLiteral of wordLiterals) {
            words[wordLiteral] = {
                count: 0,
                correct: 0,
                accuracy: 0
            };
        }
    }

    for (const deck of decksGraded) {
        for (const question of deck.deck_questions) {
            // Find Word
            const word = question.words[0][0];

            // Not Allowed
            if (wordLiterals && !wordLiterals.includes(word))
                continue
            
            if (!(word in words)) {
                words[word] = {
                    count: 0,
                    correct: 0,
                    accuracy: 0
                }
            }

            words[word].count += 1;
            if (question.choice === 0) 
                words[word].correct += 1;
        }
    }

    // Calculate Word Accuracy
    const alpha = 1;
    const beta = 1;
    for (const word of Object.keys(words)) {
        words[word].accuracy = (words[word].correct + alpha) / (words[word].count + alpha + beta);
    }
    
    return words;
}