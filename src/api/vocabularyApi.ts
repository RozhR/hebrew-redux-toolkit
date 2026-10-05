import type { CardWithId, Category } from "../types";
import { baseApi } from "./baseApi";

interface VocabularyApiItem {
    id: number;
    hebrew: string;
    translation: string;
    level: number;
}

interface VocabularyApiResponse {
    data: VocabularyApiItem[];
}

interface VocabularyQuery {
    category: Category;
    level: number;
}

const vocabularyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVocabulary: builder.query<CardWithId[], VocabularyQuery>({
            query: ({ category, level }) => `/${category}?level=${level}`,
            transformResponse: (response: VocabularyApiResponse) =>
                response.data.map((item) => ({
                    id: item.id,
                    hebrew: item.hebrew,
                    russian: item.translation,
                })),
        }),
    }),
});

export const { useGetVocabularyQuery } = vocabularyApi;
