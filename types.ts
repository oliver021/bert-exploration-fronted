export enum TabType {
    TRAINING = 'TRAINING',
    FINE_TUNING = 'FINE_TUNING',
    VECTORIZATION = 'VECTORIZATION',
    SEMANTIC_SEARCH = 'SEMANTIC_SEARCH',
    CODE_SNIPPETS = 'CODE_SNIPPETS'
}

export interface RawSentence {
    text: string;
    category: string;
}

export interface DatasetTopic {
    id: string;
    name: string;
    description: string;
    sentences: RawSentence[];
}

export interface SentenceData {
    id: string;
    text: string;
    category: string;
    vector: number[];
}

export interface SearchResult extends SentenceData {
    similarity: number;
}
