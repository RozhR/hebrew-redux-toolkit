import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store/store";

import type { Category, TestStats } from "../types";

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
    accessToken: string;
}

export interface UserProgress {
    verbs: number;
    adjectives: number;
    adverbs: number;
}

export interface UpdateProgressRequest {
    category: "verbs" | "adjectives" | "adverbs";
    unlockedLevel: number;
}

export interface UpdateProgressResponse {
    category: "verbs" | "adjectives" | "adverbs";
    unlockedLevel: number;
    updatedAt: string;
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

export const hebrewApi = createApi({
    reducerPath: "hebrewApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "/api",

        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["User", "Progress", "Statistics"],

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

        updateProgress: builder.mutation<UpdateProgressResponse, UpdateProgressRequest>({
            query: ({ category, unlockedLevel }) => ({
                url: `/progress/${category}`,
                method: "PUT",
                body: {
                    unlockedLevel,
                },
            }),

            transformResponse: (response: {
                data: {
                    category: "verbs" | "adjectives" | "adverbs";
                    unlocked_level: number;
                    updated_at: string;
                };
            }) => ({
                category: response.data.category,
                unlockedLevel: response.data.unlocked_level,
                updatedAt: response.data.updated_at,
            }),

            invalidatesTags: ["Progress"],
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
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useGetProgressQuery,
    useUpdateProgressMutation,
    useGetStatisticsQuery,
    useAddStatisticMutation,
    useClearStatisticsMutation,
} = hebrewApi;
