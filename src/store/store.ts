import { configureStore } from "@reduxjs/toolkit";

import { hebrewApi } from "../api/hebrewApi";

import { authReducer } from "./authSlice";
import { grammarReducer } from "./grammarSlice";
import { grammarTestStatisticsReducer } from "./grammarTestStatisticsSlice";
import { progressReducer } from "./progressSlice";
import { statisticsReducer } from "./statisticsSlice";

const GRAMMAR_STORAGE_KEY = "grammarWords";
const GRAMMAR_TEST_STATISTICS_STORAGE_KEY = "grammarTestStats";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        grammar: grammarReducer,
        statistics: statisticsReducer,
        progress: progressReducer,
        grammarTestStatistics: grammarTestStatisticsReducer,

        [hebrewApi.reducerPath]: hebrewApi.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(hebrewApi.middleware),
});

store.subscribe(() => {
    const state = store.getState();

    localStorage.setItem(GRAMMAR_STORAGE_KEY, JSON.stringify(state.grammar.words));

    localStorage.setItem(
        GRAMMAR_TEST_STATISTICS_STORAGE_KEY,
        JSON.stringify(state.grammarTestStatistics),
    );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
