import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { Category, TestStats } from "../types";

import type { GrammarTestAttempt, GrammarTestSection, GrammarWordRef } from "../types/grammar";

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
}

export interface UserProgress {
    verbs: number;
    adjectives: number;
    adverbs: number;
}

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

export const hebrewApi = createApi({
    reducerPath: "hebrewApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        credentials: "include",
    }),

    tagTypes: ["User", "Progress", "Statistics", "GrammarStatistics", "GrammarWords"],

    endpoints: (builder) => ({
        register: builder.mutation<User, RegisterRequest>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),

            transformResponse: (response: { data: User }) => response.data,
        }),

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),

            transformResponse: (response: { data: AuthResponse }) => response.data,

            invalidatesTags: [
                "User",
                "Progress",
                "Statistics",
                "GrammarStatistics",
                "GrammarWords",
            ],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),

            transformResponse: () => undefined,
        }),

        getCurrentUser: builder.query<User, void>({
            query: () => "/users/me",

            transformResponse: (response: { data: User }) => response.data,

            providesTags: ["User"],
        }),

        getProgress: builder.query<UserProgress, void>({
            query: () => "/progress",

            transformResponse: (response: { data: UserProgress }) => response.data,

            providesTags: ["Progress"],
        }),

        getStatistics: builder.query<TestStats, void>({
            query: () => "/statistics",

            transformResponse: (response: { data: TestStats }) => response.data,

            providesTags: ["Statistics"],
        }),

        addStatistic: builder.mutation<SavedStatistic, AddStatisticRequest>({
            query: (body) => ({
                url: "/statistics",
                method: "POST",
                body,
            }),

            transformResponse: (response: { data: SavedStatistic }) => response.data,

            invalidatesTags: ["Statistics", "Progress"],
        }),

        clearStatistics: builder.mutation<void, void>({
            query: () => ({
                url: "/statistics",
                method: "DELETE",
            }),

            transformResponse: () => undefined,

            invalidatesTags: ["Statistics"],
        }),

        getGrammarStatistics: builder.query<GrammarTestAttempt[], void>({
            query: () => "/statistics/grammar",

            transformResponse: (response: { data: GrammarTestAttempt[] }) => response.data,

            providesTags: ["GrammarStatistics"],
        }),

        addGrammarStatistic: builder.mutation<SavedGrammarStatistic, AddGrammarStatisticRequest>({
            query: (body) => ({
                url: "/statistics/grammar",
                method: "POST",
                body,
            }),

            transformResponse: (response: { data: SavedGrammarStatistic }) => response.data,

            invalidatesTags: ["GrammarStatistics"],
        }),

        clearGrammarStatistics: builder.mutation<void, void>({
            query: () => ({
                url: "/statistics/grammar",
                method: "DELETE",
            }),

            transformResponse: () => undefined,

            invalidatesTags: ["GrammarStatistics"],
        }),

        getGrammarWords: builder.query<GrammarWordRef[], void>({
            query: () => "/grammar-words",

            transformResponse: (response: { data: GrammarWordRef[] }) => response.data,

            providesTags: ["GrammarWords"],
        }),

        addGrammarWord: builder.mutation<GrammarWordRef, GrammarWordRef>({
            query: (body) => ({
                url: "/grammar-words",
                method: "POST",
                body,
            }),

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
            query: () => ({
                url: "/grammar-words",
                method: "DELETE",
            }),

            transformResponse: () => undefined,

            invalidatesTags: ["GrammarWords"],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,

    useGetCurrentUserQuery,

    useGetProgressQuery,

    useGetStatisticsQuery,
    useAddStatisticMutation,
    useClearStatisticsMutation,

    useGetGrammarStatisticsQuery,
    useAddGrammarStatisticMutation,
    useClearGrammarStatisticsMutation,

    useGetGrammarWordsQuery,
    useAddGrammarWordMutation,
    useRemoveGrammarWordMutation,
    useClearGrammarWordsMutation,
} = hebrewApi;
