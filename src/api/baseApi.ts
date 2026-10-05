import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "hebrewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        credentials: "include",
    }),
    tagTypes: ["User", "Progress", "Statistics", "GrammarStatistics", "GrammarWords"],
    endpoints: () => ({}),
});
