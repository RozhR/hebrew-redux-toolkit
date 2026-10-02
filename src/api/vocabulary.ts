import type { CardWithId, Category } from "../types";

interface VocabularyApiItem {
    id: number;
    hebrew: string;
    translation: string;
    level: number;
}

interface VocabularyApiResponse {
    count: number;
    data: VocabularyApiItem[];
}

export async function getVocabulary(category: Category, level: number): Promise<CardWithId[]> {
    const response = await fetch(`/api/${category}?level=${level}`);

    if (!response.ok) {
        throw new Error(`Failed to load ${category}, level ${level}: ${response.status}`);
    }

    const result: VocabularyApiResponse = await response.json();

    return result.data.map((item) => ({
        id: item.id,
        hebrew: item.hebrew,
        russian: item.translation,
    }));
}
