import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Category, TestAttempt, TestStats } from "../types";

const STORAGE_KEY = "testStats";

function loadStatistics(): TestStats {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return {};
        }

        const parsed: unknown = JSON.parse(saved);

        if (typeof parsed !== "object" || parsed === null) {
            return {};
        }

        return parsed as TestStats;
    } catch {
        return {};
    }
}

const initialState: TestStats = loadStatistics();

type AddTestAttemptPayload = {
    category: Category;
    level: number;
    attempt: TestAttempt;
};

const statisticsSlice = createSlice({
    name: "statistics",

    initialState,

    reducers: {
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

export const { addTestAttempt, clearStatistics } = statisticsSlice.actions;

export const statisticsReducer = statisticsSlice.reducer;
