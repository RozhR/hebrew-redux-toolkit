import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Category, TestAttempt, TestStats } from "../types";

const initialState: TestStats = {};

type AddTestAttemptPayload = {
    category: Category;
    level: number;
    attempt: TestAttempt;
};

const statisticsSlice = createSlice({
    name: "statistics",

    initialState,

    reducers: {
        setStatistics(state, action: PayloadAction<TestStats>) {
            Object.keys(state).forEach((key) => {
                delete state[key as Category];
            });

            Object.assign(state, action.payload);
        },

        addTestAttempt(state, action: PayloadAction<AddTestAttemptPayload>) {
            const { category, level, attempt } = action.payload;

            state[category] ??= {};

            state[category]![level] ??= [];

            state[category]![level]!.push(attempt);
        },

        clearStatistics() {
            return {};
        },
    },
});

export const { setStatistics, addTestAttempt, clearStatistics } = statisticsSlice.actions;

export const statisticsReducer = statisticsSlice.reducer;
