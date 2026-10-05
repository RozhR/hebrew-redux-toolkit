import type { Category, TestStats } from "../types";
import type { GrammarTestAttempt, GrammarTestSection } from "../types/grammar";
import { baseApi } from "./baseApi";

export interface AddStatisticRequest {
    category: Category;
    level: number;
    correct: number;
    total: number;
}

export interface SavedStatistic {
    id: number;
    category: Category;
    level: number;
    percent: number;
    correct: number;
    total: number;
    date: string;
}

export interface AddGrammarStatisticRequest {
    correct: number;
    total: number;
    sections: GrammarTestSection[];
}

export interface SavedGrammarStatistic extends GrammarTestAttempt {
    id: number;
}

const statisticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query<TestStats, void>({
            query: () => "/statistics",
            transformResponse: (response: { data: TestStats }) => response.data,
            providesTags: ["Statistics"],
        }),
        addStatistic: builder.mutation<SavedStatistic, AddStatisticRequest>({
            query: (body) => ({ url: "/statistics", method: "POST", body }),
            transformResponse: (response: { data: SavedStatistic }) => response.data,
            invalidatesTags: ["Statistics", "Progress"],
        }),
        clearStatistics: builder.mutation<void, void>({
            query: () => ({ url: "/statistics", method: "DELETE" }),
            transformResponse: () => undefined,
            invalidatesTags: ["Statistics"],
        }),
        getGrammarStatistics: builder.query<GrammarTestAttempt[], void>({
            query: () => "/statistics/grammar",
            transformResponse: (response: { data: GrammarTestAttempt[] }) => response.data,
            providesTags: ["GrammarStatistics"],
        }),
        addGrammarStatistic: builder.mutation<SavedGrammarStatistic, AddGrammarStatisticRequest>({
            query: (body) => ({ url: "/statistics/grammar", method: "POST", body }),
            transformResponse: (response: { data: SavedGrammarStatistic }) => response.data,
            invalidatesTags: ["GrammarStatistics"],
        }),
        clearGrammarStatistics: builder.mutation<void, void>({
            query: () => ({ url: "/statistics/grammar", method: "DELETE" }),
            transformResponse: () => undefined,
            invalidatesTags: ["GrammarStatistics"],
        }),
    }),
});

export const {
    useGetStatisticsQuery,
    useAddStatisticMutation,
    useClearStatisticsMutation,
    useGetGrammarStatisticsQuery,
    useAddGrammarStatisticMutation,
    useClearGrammarStatisticsMutation,
} = statisticsApi;
