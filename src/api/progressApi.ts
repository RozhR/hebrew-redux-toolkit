import { baseApi } from "./baseApi";

export interface UserProgress {
    verbs: number;
    adjectives: number;
    adverbs: number;
}

const progressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProgress: builder.query<UserProgress, void>({
            query: () => "/progress",
            transformResponse: (response: { data: UserProgress }) => response.data,
            providesTags: ["Progress"],
        }),
    }),
});

export const { useGetProgressQuery } = progressApi;
