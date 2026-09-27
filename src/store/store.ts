import { configureStore } from "@reduxjs/toolkit";

import { grammarReducer } from "./grammarSlice";
import { progressReducer } from "./progressSlice";
import { statisticsReducer } from "./statisticsSlice";

const GRAMMAR_STORAGE_KEY = "grammarWords";
const STATISTICS_STORAGE_KEY = "testStats";
const PROGRESS_STORAGE_KEY = "userProgress";

export const store = configureStore({
    reducer: {
        grammar: grammarReducer,
        statistics: statisticsReducer,
        progress: progressReducer,
    },
});

store.subscribe(() => {
    const state = store.getState();

    localStorage.setItem(GRAMMAR_STORAGE_KEY, JSON.stringify(state.grammar.words));

    localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(state.statistics));

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state.progress));
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;