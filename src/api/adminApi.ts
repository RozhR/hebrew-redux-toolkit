import { baseApi } from "./baseApi";

interface DailyMetric {
    date: string;
    count: number;
}

interface CategoryMetric {
    category: string;
    total_tests: number;
    average_score: string | number | null;
}

interface LevelMetric {
    category: string;
    level: number;
    users: number;
}

export interface AdminAnalytics {
    total_users: number;
    new_users_7d: number;
    new_users_30d: number;
    active_users_7d: number;
    active_users_30d: number;
    total_tests: number;
    total_grammar_tests: number;
    tests_today: number;
    average_score: string | number | null;
    registrations: DailyMetric[];
    test_activity: DailyMetric[];
    categories: CategoryMetric[];
    levels: LevelMetric[];
}

const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminAnalytics: builder.query<AdminAnalytics, void>({
            query: () => "/admin/analytics",
            transformResponse: (response: { data: AdminAnalytics }) => response.data,
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGetAdminAnalyticsQuery } = adminApi;
