"use server";

const key = process.env.NEXT_PUBLIC_MERRIAM_WEBSTER_API_KEY_DICTIONARY;


interface Pronounciation {
    mw: string;
    l: string;
    l2: string;
    pun: string;
    sound: {
        audio: string;
        ref: null;
        stat: null;
    }
}

interface Variant {
    vl: string;
    va: string;
}

interface Inflection {
    if: string;
    ifc: string;
    il: string;
    prs: null;
    spl: null
}

type AttributionQuote = {
    auth: string;
    source: string;
    aqdate: string;
    subsource: null;
}

interface VerbalIllustration {
    t: string;
    aq: AttributionQuote;
}

type RunIn = (
    ['text', string] |
    ['riw', {
        'rie': string;
        prs: Pronounciation[];
        vrs: Variant[];
    }]
)

type Sense = ['sense', {
    // Sense Number
    sn: string;
    dt: (
        ['text', string] |
        ['vis', VerbalIllustration[]] |
        ['ri', RunIn[]] |
        ['bnw', {
            'pname': string;
            prs: Pronounciation[];
        }] | 
        ['ca', {
            intro: string,
            cats: {
                cat: string;
                catref: string;
                pn: string;
                prs: Pronounciation[];
                psl: string;
            }
        }] |
        ['snote', (
            ['t', string]|
            ['vis', VerbalIllustration[]]|
            ['ri', RunIn[]]
        )[]] |
        ['uns', (
            ['text', string]|
            ['vis', VerbalIllustration[]]|
            ['ri', RunIn[]]
        )[]]
    )[];
    et: (
        ['text', string] |
        ['et_snote', ['t', string][]]
    )[];
    ins: Inflection[];
    lbs: string[];
    prs: Pronounciation[];
    sdsense: Sense & {
        sd: string;
    }
    sgram: string;
    sls: string[];
    vrs: Variant[];
}];

// Truncated Sense
// "A truncated sense is a sense without a definition, and is used almost exclusively 
// when two sense numbers are separated by a non-definition element."
// Example: tab
type TruncatedSense = ['sen', Partial<{
    sn: string;
    et: (
        ['text', string] |
        ['et_snote', ['t', string][]]
    )[];
    ins: Inflection[];
    lbs: string[];
    prs: Pronounciation[];
    sdsense: Sense & {
        sd: string;
    }
    sgram: string;
    sls: string[];
    vrs: Variant[];
}>];

// Binding Substitute
// The binding substitute is a broad, general sense introducing a series of senses
// that give more contextual and specific meanings.
type BindingSubstitute = ['bs', Sense[1]];

// Parenthesized Sense Sequence
type ParenthesizedSenseSequence = ['pseq', (TruncatedSense|BindingSubstitute|Sense)[]];

export type Entry = {
    meta: {
        id: string,
        uuid: string,
        sort: string,
        src: string,
        section: string,
        stems: string[],
        offensive: boolean
    };
    // Homograph
    hom: number;
    // Headword Information
    hwi: {
        hw: string;
        // Pronounciations
        prs: Array<Pronounciation>;
        // Parenthesized Subject/Status Label
        psl: string;
    }
    // Alternate Headwords
    ahws: Array<{
        hw: string;
    }>;
    // Variants
    vrs: Array<Variant>;
    // Functional Label
    fl: string;
    // General Labels
    lbs: string[];
    def: {
        // Verb Divider
        vd: string;
        // Sense Sequence
        sseq: (Sense|BindingSubstitute|ParenthesizedSenseSequence|TruncatedSense)[][];
    }[];
    uros: {
        ure: string;
        fl: string;
        utxt: null;
    }[]
    date: string;
    usages: {
        pl: string;
        pt: (
            ['text', string] |
            ['vis', VerbalIllustration] | 
            ['uarefs', {
                uaref: string
            }[]]
        )[];
    }[];
    syns: {
        pl: string;
        pt: (
            ['text', string] |
            ['vis', VerbalIllustration] | 
            ['sarefs', string[]]
        )[];
    }[];
};


export default async function getWordEntries(word: string): Promise<any> {
    let url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
    url += `${word}?`;
    url += `key=${key}`;

    const response = await fetch(url);
    const data = await response.json();
    
    return data;
}