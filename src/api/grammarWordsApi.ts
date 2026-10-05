import type { GrammarWordRef } from "../types/grammar";
import { baseApi } from "./baseApi";

const grammarWordsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGrammarWords: builder.query<GrammarWordRef[], void>({
            query: () => "/grammar-words",
            transformResponse: (response: { data: GrammarWordRef[] }) => response.data,
            providesTags: ["GrammarWords"],
        }),
        addGrammarWord: builder.mutation<GrammarWordRef, GrammarWordRef>({
            query: (body) => ({ url: "/grammar-words", method: "POST", body }),
            transformResponse: (response: { data: GrammarWordRef }) => response.data,
            invalidatesTags: ["GrammarWords"],
        }),
        removeGrammarWord: builder.mutation<void, GrammarWordRef>({
            query: ({ category, id }) => ({
                url: `/grammar-words/${category}/${id}`,
                method: "DELETE",
            }),
            transformResponse: () => undefined,
            invalidatesTags: ["GrammarWords"],
        }),
        clearGrammarWords: builder.mutation<void, void>({
            query: () => ({ url: "/grammar-words", method: "DELETE" }),
            transformResponse: () => undefined,
            invalidatesTags: ["GrammarWords"],
        }),
    }),
});

export const {
    useGetGrammarWordsQuery,
    useAddGrammarWordMutation,
    useRemoveGrammarWordMutation,
    useClearGrammarWordsMutation,
} = grammarWordsApi;
