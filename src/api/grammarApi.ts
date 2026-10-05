import type { AdjectiveGrammar, AdverbGrammar, VerbGrammar } from "../types/grammar";
import { baseApi } from "./baseApi";

function idsQuery(ids: number[]) {
    return ids.join(",");
}

const grammarApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVerbGrammars: builder.query<VerbGrammar[], number[]>({
            query: (ids) => `/grammar/verbs?ids=${idsQuery(ids)}`,
            transformResponse: (response: { data: VerbGrammar[] }) => response.data,
        }),
        getAdjectiveGrammars: builder.query<AdjectiveGrammar[], number[]>({
            query: (ids) => `/grammar/adjectives?ids=${idsQuery(ids)}`,
            transformResponse: (response: { data: AdjectiveGrammar[] }) => response.data,
        }),
        getAdverbGrammars: builder.query<AdverbGrammar[], number[]>({
            query: (ids) => `/grammar/adverbs?ids=${idsQuery(ids)}`,
            transformResponse: (response: { data: AdverbGrammar[] }) => response.data,
        }),
    }),
});

export const { useGetVerbGrammarsQuery, useGetAdjectiveGrammarsQuery, useGetAdverbGrammarsQuery } =
    grammarApi;
