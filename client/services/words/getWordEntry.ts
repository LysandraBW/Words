"use server";

// I was not doing a good job of
// creating types, so I prompted
// Claude and asked it to generate said
// types. To do so, I passed in
// the documentation I had been using:
// https://dictionaryapi.com/products/json#sec-2.uros

// I'll be checking to see whether the
// generated types are incorrect by
// using them.

export type Sound = {
  audio: string;
  ref?: string;
  stat?: string;
};

export type Pronunciation = {
  mw?: string;
  l?: string;
  l2?: string;
  pun?: string;
  sound?: Sound;
};

export type Variant = {
  va: string;
  vl?: string;
  prs?: Pronounciations;
  spl?: string;
};

export type Inflection = {
  if?: string;
  ifc?: string;
  il?: string;
  prs?: Pronounciations;
  spl?: string;
};

export type Pronounciations = Pronunciation[];
export type Variants = Variant[];
export type Inflections = Inflection[];
export type GeneralLabels = string[];
export type SubjectStatusLabels = string[];

export type CognateTarget = {
  cxl?: string;
  cxr?: string;
  cxt: string;
  cxn?: string;
};

export type CognateCrossReference = {
  cxl?: string;
  cxtis: CognateTarget[];
};

export type CognateCrossReferences = CognateCrossReference[];

export type RunInWrap = {
  rie: string;
  prs?: Pronounciations;
};

export type RunInElement = ["riw", RunInWrap] | ["text", string];
export type RunIn = ["ri", RunInElement[]];

export type SubSource = {
  source?: string;
  aqdate?: string;
};

export type AttributeQuotation = {
  auth?: string;
  source?: string;
  aqdate?: string;
  subsource?: SubSource;
};

export type VerbalIllustrationData = {
  t: string;
  aq?: AttributeQuotation;
};

export type VerbalIllustration = ["vis", VerbalIllustrationData[]];

export type CalledAlsoTarget = {
  cat: string;
  catref?: string;
  pn?: string;
  prs?: Pronounciations;
  psl?: string;
};
export type CalledAlso = ["ca", { 
    intro: string; 
    cats: CalledAlsoTarget[] 
}];

export type BiographicalNameWrapData = {
  pname?: string;
  sname?: string;
  altname?: string;
  prs?: Pronounciations;
};

export type BiographicalNameWrap = ["bnw", BiographicalNameWrapData];

export type SupplementalNoteData = (
    ["t", string] |
    RunIn |
    VerbalIllustration
);

export type SupplementalNote = ["snote", SupplementalNoteData[]];

export type UsageNoteData =
  | ["text", string]
  | RunIn
  | VerbalIllustration;

export type UsageNotes = ["uns", UsageNoteData[][]];

type DefiningTextElement =
  | ["text", string]
  | VerbalIllustration
  | RunIn
  | CalledAlso
  | BiographicalNameWrap
  | SupplementalNote
  | UsageNotes;

export type DefiningText = DefiningTextElement[];

export type DividedSense = {
  sd: string;
  dt: DefiningText;
  et?: Etymology;
  ins?: Inflections;
  lbs?: GeneralLabels;
  prs?: Pronounciations;
  sgram?: string;
  sls?: SubjectStatusLabels;
  vrs?: Variants;
};

export type Sense = {
  sn?: string;
  dt: DefiningText;
  et?: Etymology;
  ins?: Inflections;
  lbs?: GeneralLabels;
  prs?: Pronounciations;
  sdsense?: DividedSense;
  sgram?: string;
  sls?: SubjectStatusLabels;
  vrs?: Variants;
};

export type TruncatedSense = {
  sn?: string;
  et?: Etymology;
  ins?: Inflections;
  lbs?: GeneralLabels;
  prs?: Pronounciations;
  sgram?: string;
  sls?: SubjectStatusLabels;
  vrs?: Variants;
};

export type BindingSubstitute = {
  sense: Sense;
};

export type ParenthesizedSequenceElement = 
    ["sense", Sense] | 
    ["sen", TruncatedSense] | 
    ["bs", BindingSubstitute];
  
export type SenseSequenceElement = (
    ["sense", Sense] | 
    ["sen", TruncatedSense] | 
    ["bs", BindingSubstitute] | 
    ["pseq", ParenthesizedSequenceElement[]]
);
export type SenseSequence = SenseSequenceElement[][];

export type DefinitionData = {
  vd?: string;
  sls?: SubjectStatusLabels;
  sseq: SenseSequence;
};

export type Definition = DefinitionData[];

export type EtymologySupplementalNote = ["et_snote", [["t", string]]];
export type EtymologyElement =
  | ["text", string]
  | EtymologySupplementalNote;

export type Etymology = EtymologyElement[];

export type UndefinedRunOnTextElement = VerbalIllustration | UsageNotes;
export type UndefinedRunOn = {
  ure: string;
  fl: string;
  prs?: Pronounciations;
  psl?: string;
  ins?: Inflections;
  lbs?: GeneralLabels;
  sls?: SubjectStatusLabels;
  vrs?: Variants;
  utxt?: UndefinedRunOnTextElement[];
};
export type UndefinedRunOns = UndefinedRunOn[];

export type DefinedRunOn = {
  drp: string;
  def: Definition;
  et?: Etymology;
  lbs?: GeneralLabels;
  prs?: Pronounciations;
  psl?: string;
  sls?: SubjectStatusLabels;
  vrs?: Variants;
};
export type DefinedRunOns = DefinedRunOn[];

export type Meta = {
  id: string;
  uuid: string;
  sort: string;
  src: string;
  section: "alpha" | "biog" | "geog" | "fw&p";
  stems: string[];
  offensive: boolean;
};

export type HeadWordInformation = {
  hw: string;
  prs?: Pronounciations;
};

export type AltHeadWord = {
  hw: string;
  prs?: Pronounciations;
  psl?: string;
};

export type UsageDiscussion = {
  pl: string;
  pt: (["text", string] | VerbalIllustration)[];
  uarefs?: { uaref: string };
};

export type SynonymDiscussion = {
  pl: string;
  pt: (["text", string] | VerbalIllustration)[];
  sarefs?: string[];
};

export type QuoteItem = {
  t: string;
  aq: AttributeQuotation;
};

export type Art = {
  artid: string;
  capt?: string;
};

export type Table = {
  tableid: string;
  displayname: string;
};

export type Entry = {
  meta: Meta;
  hom?: number;
  hwi: HeadWordInformation;
  ahws?: AltHeadWord[];
  vrs?: Variants;
  fl?: string;
  lbs?: GeneralLabels;
  sls?: SubjectStatusLabels;
  ins?: Inflections;
  cxs?: CognateCrossReferences;
  def?: Definition;
  uros?: UndefinedRunOns;
  dros?: DefinedRunOns;
  dxnls?: string[];
  usages?: UsageDiscussion[];
  syns?: SynonymDiscussion[];
  quotes?: QuoteItem[];
  art?: Art;
  table?: Table;
  et?: Etymology;
  date?: string;
  shortdef?: string[];
};

const key = process.env.NEXT_PUBLIC_MERRIAM_WEBSTER_API_KEY_DICTIONARY;

export default async function getWordEntries(word: string): Promise<Entry[]> {
    let url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
    url += `${word}?`;
    url += `key=${key}`;

    const response = await fetch(url);
    const data = await response.json();
    
    return data;
}