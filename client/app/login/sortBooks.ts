// import { getColorSync } from 'colorthief';
// import { books as allBooks } from './books';

// function rgbToHue(r: number, g: number, b: number): number {
//     r /= 255; g /= 255; b /= 255;
//     const max = Math.max(r, g, b), min = Math.min(r, g, b);
//     const d = max - min;
//     if (d === 0) return 0;
//     switch (max) {
//         case r: return ((g - b) / d + (g < b ? 6 : 0)) / 6;
//         case g: return ((b - r) / d + 2) / 6;
//         case b: return ((r - g) / d + 4) / 6;
//         default: return 0;
//     }
// }

// export default async function sortBooksByColor(books: typeof allBooks) {
//     const withColors = await Promise.all(books.map(book => new Promise<{ book: typeof book, hue: number }>(resolve => {
//         const img = new Image();
//         img.src = book.background.slice(9, -3);
//         img.onload = () => {
//             const rgb = getColorSync(img)?.rgb();
//             if (!rgb)
//                 return {book, hue: 0};
//             const hue = rgbToHue(rgb.r, rgb.g, rgb.b);
//             resolve({ book, hue });
//         };
//     })));

//     return withColors.sort((a, b) => a.hue - b.hue).map(x => x.book);
// }

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

function rgbToLuminance(r: number, g: number, b: number): number {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function rgbToSaturation(r: number, g: number, b: number): number {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return 0;
    const d = max - min;
    return d / (1 - Math.abs(2 * l - 1));
}

const HUE_BUCKETS = 12;

export default async function sortBooksByColor(books: typeof allBooks) {
    const withColor = await Promise.all(books.map(book => new Promise<{
        book: typeof book,
        hue: number,
        luminance: number,
        saturation: number
    }>(resolve => {
        const img = new Image();
        img.src = book.background.slice(9, -3);
        img.onload = () => {
            const rgb = getColorSync(img)?.rgb();
            if (!rgb)
                return resolve({ book, hue: 0, luminance: 255, saturation: 0 });
            const { r, g, b } = rgb;
            resolve({
                book,
                hue: rgbToHue(r, g, b),
                luminance: rgbToLuminance(r, g, b),
                saturation: rgbToSaturation(r, g, b),
            });
        };
        img.onerror = () => resolve({ book, hue: 0, luminance: 255, saturation: 0 });
    })));

    return withColor.sort((a, b) => {
        // push near-grayscale books (low saturation) to the end
        const aGray = a.saturation < 0.15;
        const bGray = b.saturation < 0.15;
        if (aGray !== bGray) return aGray ? 1 : -1;

        // sort grayscale books among themselves by luminance (light → dark)
        if (aGray && bGray) return b.luminance - a.luminance;

        // bucket colorful books by hue (red → orange → yellow → green → blue → purple)
        const aBucket = Math.floor(a.hue * HUE_BUCKETS);
        const bBucket = Math.floor(b.hue * HUE_BUCKETS);
        if (aBucket !== bBucket) return aBucket - bBucket;

        // within the same hue bucket, sort light → dark
        return b.luminance - a.luminance;
    }).map(x => x.book);
}