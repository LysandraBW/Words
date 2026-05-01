import 'dotenv/config';
import retry from 'async-retry';
import * as lancedb from "@lancedb/lancedb";
import words from 'an-array-of-english-words' with { type: 'json' };
import natural from 'natural';


const wordnet = new natural.WordNet();


function lookup(word: string): Promise<natural.DataRecord[]> {
    return new Promise((res, rej) => {
        wordnet.lookup(word, (results) => res(results));
    });
}

function get(offset: number, pos: string): Promise<natural.DataRecord> {
    return new Promise((res, rej) => {
        wordnet.get(offset, pos, (results) => res(results));
    });
}

export async function getSimilarWordsWordNet(word: string): Promise<string[]> {
    const entries = await lookup(word);
    const similars: string[] = []

    for (const entry of entries) {
        for (const ptr of entry.ptrs) {
            if (ptr.pointerSymbol !== '@')
                continue;

            const parentEntry = await get(ptr.synsetOffset, ptr.pos);
            for (const parentPtr of parentEntry.ptrs) {
                if (parentPtr.pointerSymbol !== '~')
                    continue;

                const childEntry = await get(parentPtr.synsetOffset, parentPtr.pos);
                similars.push(childEntry.lemma.replaceAll('_', ' '));
            }
        }
    }

    return similars;
}


export async function getSimilarWords(word: string, n: number = 20) {
    const embeddings = await lancedb.connect("./src/embeddings");
    const embeddingsTable = embeddings.openTable("Embeddings");
    
    const wordEmbedding = await (await embeddingsTable).query().where(`word = '${word}'`).toArray();
    const wordEmbeddingVector = wordEmbedding[0]?.vector;
    
    if (!wordEmbeddingVector)
        return [];

    const neighbors = await (await embeddingsTable).vectorSearch(wordEmbeddingVector).distanceType('cosine').where(`word NOT LIKE '%${word}%'`).limit(n).toArray();
    return neighbors.map(neighbor => neighbor.word);
}


export async function getRandomWords(word: string = "", wordDefinition: string = "", n: number = 3): Promise<[string, string][]> {
    const pool = await getSimilarWordsWordNet(word) || await getSimilarWords(word.toLowerCase(), Math.max(50, n)) || words;
    
    // Shuffle Indices
    const poolIndices = [...Array(pool.length)].map((e, i) => i);
    poolIndices.sort(() => Math.random() - 0.5); // Shuffle Indices

    // Offset
    // If a word isn't working out, for whatever reason,
    // we use to the offset to move on from it.
    let offset = 0;
    
    const randWords: [string, string][] = [];

    for (let i = 0; i < n; i++) {
        try {
            await retry(async () => {
                if (i + offset >= poolIndices.length) 
                    return;

                const randIndex = poolIndices[i + offset] as number;
                const randWord = pool[randIndex];
                if (!randWord)
                    throw new Error('Random Index Out of Bounds');

                let url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
                url += `${randWord}?key=${process.env.MERRIAM_WEBSTER_API_KEY_DICTIONARY}`;

                const data = await (await fetch(url)).json();
                const defs = data[0].shortdef.filter((definition: string) => definition !== wordDefinition);

                if (!defs || !defs.length) {
                    offset += 1;
                    throw -1;
                }

                const randDefIndex = Math.floor(Math.random() * defs.length);
                const randDef = defs[randDefIndex];
                randWords.push([randWord, randDef]);
            }, {
                retries: 5,
                minTimeout: 100,
                maxTimeout: 2000
            });
        }
        catch (err) {
            console.error(err);
            continue;
        }
    }

    return randWords;
}