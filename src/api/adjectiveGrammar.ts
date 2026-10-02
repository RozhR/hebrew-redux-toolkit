import type { AdjectiveGrammar } from "../types/grammar";

interface VocabularyItem {
    id: number;
    hebrew: string;
    translation: string;
    level: number;
}

interface FormsApi {
    masculine_singular: string;
    feminine_singular: string;
    masculine_plural: string;
    feminine_plural: string;
}

interface ConstructionApi {
    construction: string;
    meaning: string;
}

interface ExamplesApi {
    example1: string;
    translation1: string;
    example2: string;
    translation2: string;
    example3: string;
    translation3: string;
}

interface GrammarApiResponse<T> {
    adjective: VocabularyItem;
    data: T;
}

async function fetchPart<T>(url: string): Promise<GrammarApiResponse<T>> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load adjective grammar: ${response.status}`);
    }

    return response.json() as Promise<GrammarApiResponse<T>>;
}

export async function getAdjectiveGrammarFromApi(id: number): Promise<AdjectiveGrammar> {
    const [formsResponse, constructionResponse, examplesResponse] = await Promise.all([
        fetchPart<FormsApi>(`/api/grammar/adjectives/forms/${id}`),

        fetchPart<ConstructionApi | null>(`/api/grammar/adjectives/constructions/${id}`),

        fetchPart<ExamplesApi>(`/api/grammar/adjectives/examples/${id}`),
    ]);

    const adjective = formsResponse.adjective;

    return {
        base: {
            id: adjective.id,

            masculine_singular: formsResponse.data.masculine_singular,

            feminine_singular: formsResponse.data.feminine_singular,

            masculine_plural: formsResponse.data.masculine_plural,

            feminine_plural: formsResponse.data.feminine_plural,

            translation: adjective.translation,

            level: adjective.level,
        },

        construction: constructionResponse.data
            ? {
                  id: adjective.id,

                  adjective: adjective.hebrew,

                  construction: constructionResponse.data.construction,

                  meaning: constructionResponse.data.meaning,
              }
            : undefined,

        examples: {
            id: adjective.id,

            adjective: adjective.hebrew,

            translation: adjective.translation,

            ...examplesResponse.data,
        },
    };
}
