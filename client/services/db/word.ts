export interface WordType {
    word_id: number;
    word: [string, string];
    word_number_instances: number;
    chapter_id: number;
    created_at: string;
    last_seen: string;
}


export async function selectWords() {
    const response = await fetch('http://127.0.0.1:8000/words', {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType[] | null = await response.json();
    return data;
}

export async function insertWord(word: WordType) {
    const response = await fetch('http://127.0.0.1:8000/words', {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(word)
    });

    if (response.status !== 200)
        return null;

    const data: WordType | null = await response.json();
    return data;
}


export async function deleteWord(wordID: number) {
    const response = await fetch(`http://127.0.0.1:8000/words/${wordID}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType | null = await response.json();
    return data;

}

export async function incrementWordNumberInstances(wordID: number) {
    const response = await fetch(`http://127.0.0.1:8000/words/${wordID}/increment`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType | null = await response.json();
    return data;

}

export async function decrementWordNumberInstances(wordID: number) {
    const response = await fetch(`http://127.0.0.1:8000/words/${wordID}/decrement`, {
        method: "GET",
        credentials: "include"
    });

    if (response.status !== 200)
        return null;

    const data: WordType | null = await response.json();
    return data;
}