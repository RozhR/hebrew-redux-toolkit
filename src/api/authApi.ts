import { baseApi } from "./baseApi";

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

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<User, RegisterRequest>({
            query: (body) => ({ url: "/auth/register", method: "POST", body }),
            transformResponse: (response: { data: User }) => response.data,
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({ url: "/auth/login", method: "POST", body }),
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
            query: () => ({ url: "/auth/logout", method: "POST" }),
            transformResponse: () => undefined,
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => "/users/me",
            transformResponse: (response: { data: User }) => response.data,
            providesTags: ["User"],
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } =
    authApi;
