import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store/store";

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

    tagTypes: ["User"],

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
    }),
});

export const { useRegisterMutation, useLoginMutation, useGetCurrentUserQuery } = hebrewApi;
