import { configureStore } from "@reduxjs/toolkit";

import { hebrewApi } from "../api/hebrewApi";

import { authReducer } from "./authSlice";
import { grammarReducer } from "./grammarSlice";
import { grammarTestStatisticsReducer } from "./grammarTestStatisticsSlice";
import { progressReducer } from "./progressSlice";
import { statisticsReducer } from "./statisticsSlice";

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

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
