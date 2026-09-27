import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { CATEGORIES, CATEGORY_CONFIG } from "../config/categories";

import type { Category, TestAttempt, TestStats } from "../types";

const STORAGE_KEY = "testStats";

function isTestAttempt(value: unknown): value is TestAttempt {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const attempt = value as Record<string, unknown>;

    return (
        typeof attempt.percent === "number" &&
        Number.isFinite(attempt.percent) &&
        typeof attempt.correct === "number" &&
        Number.isInteger(attempt.correct) &&
        typeof attempt.total === "number" &&
        Number.isInteger(attempt.total) &&
        typeof attempt.date === "string"
    );
}

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

        const rawStats = parsed as Record<string, unknown>;

        const result: TestStats = {};

        CATEGORIES.forEach((category) => {
            const rawCategory = rawStats[category];

            if (typeof rawCategory !== "object" || rawCategory === null) {
                return;
            }

            const categoryStats = rawCategory as Record<string, unknown>;

            const validLevels: Record<number, TestAttempt[]> = {};

            Object.entries(categoryStats).forEach(([levelString, attempts]) => {
                const level = Number(levelString);

                if (
                    !Number.isInteger(level) ||
                    level < 1 ||
                    level > CATEGORY_CONFIG[category].levels ||
                    !Array.isArray(attempts)
                ) {
                    return;
                }

                const validAttempts = attempts.filter(isTestAttempt);

                if (validAttempts.length > 0) {
                    validLevels[level] = validAttempts;
                }
            });

            if (Object.keys(validLevels).length > 0) {
                result[category] = validLevels;
            }
        });

        return result;
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
