import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "hebrewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
        credentials: "include",
    }),
    tagTypes: ["User", "Progress", "Statistics", "GrammarStatistics", "GrammarWords"],
    endpoints: () => ({}),
});
