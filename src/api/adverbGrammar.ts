import type { AdverbGrammar } from "../types/grammar";

interface VocabularyItem {
    id: number;
    hebrew: string;
    translation: string;
    level: number;
}

interface UsageApi {
    main_meaning: string;
    semantic_category: string;
    register: string;
    usage: string;
}

interface RelationApi {
    synonym: string;
    antonym: string;
    related_expression: string;
    comment: string;
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
    adverb: VocabularyItem;
    data: T;
}

async function fetchPart<T>(url: string): Promise<GrammarApiResponse<T>> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load adverb grammar: ${response.status}`);
    }

    return response.json() as Promise<GrammarApiResponse<T>>;
}

export async function getAdverbGrammarFromApi(id: number): Promise<AdverbGrammar> {
    const [usageResponse, relationResponse, examplesResponse] = await Promise.all([
        fetchPart<UsageApi>(`/api/grammar/adverbs/usage/${id}`),

        fetchPart<RelationApi | null>(`/api/grammar/adverbs/relations/${id}`),

        fetchPart<ExamplesApi>(`/api/grammar/adverbs/examples/${id}`),
    ]);

    const adverb = usageResponse.adverb;

    const category = usageResponse.data.semantic_category;

    return {
        base: {
            id: adverb.id,

            adverb: adverb.hebrew,

            translation: adverb.translation,

            category,

            level: adverb.level,
        },

        usage: {
            id: adverb.id,

            adverb: adverb.hebrew,

            main_meaning: usageResponse.data.main_meaning,

            category,

            register: usageResponse.data.register,

            usage: usageResponse.data.usage,
        },

        relation: relationResponse.data
            ? {
                  id: adverb.id,

                  adverb: adverb.hebrew,

                  ...relationResponse.data,
              }
            : undefined,

        examples: {
            id: adverb.id,

            adverb: adverb.hebrew,

            category,

            ...examplesResponse.data,
        },
    };
}
