import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { CATEGORY_CONFIG, CATEGORIES } from "../config/categories";

import { PASS_PERCENT } from "../config/test";

import type { Category, TestStats } from "../types";

export type UserProgress = Record<Category, number>;

const DEFAULT_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

function getProgressFromStatistics(): UserProgress {
    const progress: UserProgress = {
        ...DEFAULT_PROGRESS,
    };

    try {
        const savedStats = localStorage.getItem("testStats");

        if (!savedStats) {
            return progress;
        }

        const stats: TestStats = JSON.parse(savedStats);

        CATEGORIES.forEach((category) => {
            const categoryStats = stats[category];

            if (!categoryStats) {
                return;
            }

            Object.entries(categoryStats).forEach(([levelString, attempts]) => {
                const level = Number(levelString);

                const passed = attempts.some((attempt) => attempt.percent >= PASS_PERCENT);

                if (!passed) {
                    return;
                }

                const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

                progress[category] = Math.max(progress[category], nextLevel);
            });
        });
    } catch {
        return progress;
    }

    return progress;
}

function loadProgress(): UserProgress {
    try {
        const saved = localStorage.getItem("userProgress");

        if (saved) {
            return {
                ...DEFAULT_PROGRESS,
                ...JSON.parse(saved),
            };
        }
    } catch {
        // Восстанавливаем прогресс из статистики.
    }

    return getProgressFromStatistics();
}

const initialState: UserProgress = loadProgress();

type UnlockNextLevelPayload = {
    category: Category;
    level: number;
};

const progressSlice = createSlice({
    name: "progress",

    initialState,

    reducers: {
        unlockNextLevel(state, action: PayloadAction<UnlockNextLevelPayload>) {
            const { category, level } = action.payload;

            const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

            state[category] = Math.max(state[category], nextLevel);
        },
    },
});

export const { unlockNextLevel } = progressSlice.actions;

export const progressReducer = progressSlice.reducer;
