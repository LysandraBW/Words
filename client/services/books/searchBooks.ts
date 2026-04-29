"use server";
import { books_v1 } from "googleapis";

export type VolumeInfo = NonNullable<books_v1.Schema$Volume["volumeInfo"]>;

// We filter the API's results to only retrieve books
// with corresponding volume information and an ID.
// So, we reflect this in the below type.
export type GoogleBook = Omit<books_v1.Schema$Volume, "id" | "volumeInfo"> & {
    id: string;
    volumeInfo: VolumeInfo;
};

const cache: {[k: string]: GoogleBook[]} = {};

export default async function searchBooks(search: string, startIndex: number = 0, maxResults: number = 10): Promise<GoogleBook[]> {
    if (search.length <= 0)
        return [];

    // Check Cache
    const cacheHasBooks = cache[search] && [...Array(maxResults)].map((e, i) => startIndex + i).every(i => i in cache[search] && cache[search][i] !== undefined);
    if (cacheHasBooks)
        return cache[search].slice(startIndex, startIndex + maxResults);
    
    let url = "https://www.googleapis.com/books/v1/volumes?";
    url += `q=${encodeURIComponent(search)}`;
    url += `&startIndex=${startIndex}`;
    url += `&maxResults=${maxResults}`;
    url += `&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    
    const response = await fetch(url);
    const data: books_v1.Schema$Volumes = await response.json();
    
    // Filter for Valid Books
    let items = data.items ?? [];
    items = items.filter(item => item.id && item.volumeInfo);

    // Store in Cache
    if (items && items.length) {
        const cachedItems = Array(Math.max((cache[search] ?? []).length, startIndex + maxResults));
        for (let i = startIndex; i < startIndex + maxResults; i++) 
            cachedItems[i] = items[i - startIndex] || null;
        cache[search] = cachedItems;
    }
    
    return items as GoogleBook[];
}