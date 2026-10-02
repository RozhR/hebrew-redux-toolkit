import type { VerbGrammar } from "../types/grammar";

interface ApiResponse<T> {
    data: T;
}

interface VerbBaseApi {
    id: number;
    hebrew: string;
    translation: string;
    level: number;
    government: string;
    binyan: string;
}

interface VerbPresentApi {
    masculine_singular: string;
    feminine_singular: string;
    masculine_plural: string;
    feminine_plural: string;
}

interface VerbPastApi {
    first_person_singular: string;
    second_person_masculine_singular: string;
    second_person_feminine_singular: string;
    third_person_masculine_singular: string;
    third_person_feminine_singular: string;
    first_person_plural: string;
    second_person_masculine_plural: string;
    second_person_feminine_plural: string;
    third_person_plural: string;
}

type VerbFutureApi = VerbPastApi;

interface VerbImperativeApi {
    imperative_masculine: string;
    imperative_feminine: string;
    imperative_plural: string;
}

interface VerbExamplesApi {
    present_example: string;
    present_translation: string;
    past_example: string;
    past_translation: string;
    future_example: string;
    future_translation: string;
}

async function fetchGrammarPart<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load grammar: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();

    return result.data;
}

export async function getVerbGrammarFromApi(id: number): Promise<VerbGrammar> {
    const [base, present, past, future, imperative, examples] = await Promise.all([
        fetchGrammarPart<VerbBaseApi>(`/api/grammar/verbs/base/${id}`),

        fetchGrammarPart<VerbPresentApi>(`/api/grammar/verbs/present/${id}`),

        fetchGrammarPart<VerbPastApi>(`/api/grammar/verbs/past/${id}`),

        fetchGrammarPart<VerbFutureApi>(`/api/grammar/verbs/future/${id}`),

        fetchGrammarPart<VerbImperativeApi>(`/api/grammar/verbs/imperative/${id}`),

        fetchGrammarPart<VerbExamplesApi>(`/api/grammar/verbs/examples/${id}`),
    ]);

    return {
        base: {
            id: base.id,
            infinitive: base.hebrew,
            translation: base.translation,
            government: base.government,
            level: base.level,
        },

        present: {
            id: base.id,
            infinitive: base.hebrew,
            binyan: base.binyan,
            ...present,
        },

        past: {
            id: base.id,
            infinitive: base.hebrew,
            ...past,
        },

        future: {
            id: base.id,
            infinitive: base.hebrew,
            ...future,
            ...imperative,
        },

        examples: {
            id: base.id,
            infinitive: base.hebrew,
            translation: base.translation,
            ...examples,
        },
    };
}
