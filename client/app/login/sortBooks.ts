import { getColorSync } from 'colorthief';
import { books as allBooks } from './books';

function rgbToHue(r: number, g: number, b: number): number {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    if (d === 0) return 0;
    switch (max) {
        case r: return ((g - b) / d + (g < b ? 6 : 0)) / 6;
        case g: return ((b - r) / d + 2) / 6;
        case b: return ((r - g) / d + 4) / 6;
        default: return 0;
    }
}

export default async function sortBooksByColor(books: typeof allBooks) {
    const withColors = await Promise.all(books.map(book => new Promise<{ book: typeof book, hue: number }>(resolve => {
        const img = new Image();
        img.src = book.background.slice(9, -3);
        img.onload = () => {
            const rgb = getColorSync(img)?.rgb();
            if (!rgb)
                return {book, hue: 0};
            const hue = rgbToHue(rgb.r, rgb.g, rgb.b);
            resolve({ book, hue });
        };
    })));

    return withColors.sort((a, b) => a.hue - b.hue).map(x => x.book);
}