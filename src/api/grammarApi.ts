import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { AdjectiveGrammar, AdverbGrammar, VerbGrammar } from "../types/grammar";
import { baseApi } from "./baseApi";

const GRAMMAR_BATCH_SIZE = 100;

type GrammarResponse = { data?: unknown; error?: FetchBaseQueryError };
type FetchGrammar = (url: string) => GrammarResponse | PromiseLike<GrammarResponse>;

export async function fetchGrammarBatches<T>(ids: number[], category: string, fetch: FetchGrammar) {
    const uniqueIds = [...new Set(ids)];
    const items: T[] = [];

    for (let offset = 0; offset < uniqueIds.length; offset += GRAMMAR_BATCH_SIZE) {
        const batch = uniqueIds.slice(offset, offset + GRAMMAR_BATCH_SIZE);
        const result = await fetch(`/grammar/${category}?ids=${batch.join(",")}`);

        if (result.error) {
            return { error: result.error };
        }

        const response = result.data as { data: T[] };
        items.push(...response.data);
    }

    return { data: items };
}

const grammarApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVerbGrammars: builder.query<VerbGrammar[], number[]>({
            queryFn: (ids, _api, _options, fetch) =>
                fetchGrammarBatches<VerbGrammar>(ids, "verbs", fetch),
        }),
        getAdjectiveGrammars: builder.query<AdjectiveGrammar[], number[]>({
            queryFn: (ids, _api, _options, fetch) =>
                fetchGrammarBatches<AdjectiveGrammar>(ids, "adjectives", fetch),
        }),
        getAdverbGrammars: builder.query<AdverbGrammar[], number[]>({
            queryFn: (ids, _api, _options, fetch) =>
                fetchGrammarBatches<AdverbGrammar>(ids, "adverbs", fetch),
        }),
    }),
});

export const { useGetVerbGrammarsQuery, useGetAdjectiveGrammarsQuery, useGetAdverbGrammarsQuery } =
    grammarApi;
