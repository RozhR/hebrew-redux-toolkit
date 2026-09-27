import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { CATEGORIES, CATEGORY_CONFIG } from "../config/categories";

import { PASS_PERCENT } from "../config/test";

import type { Category } from "../types";

export type UserProgress = Record<Category, number>;

const PROGRESS_STORAGE_KEY = "userProgress";
const STATISTICS_STORAGE_KEY = "testStats";

const DEFAULT_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getProgressFromStatistics(): UserProgress {
    const progress: UserProgress = {
        ...DEFAULT_PROGRESS,
    };

    try {
        const savedStats = localStorage.getItem(STATISTICS_STORAGE_KEY);

        if (!savedStats) {
            return progress;
        }

        const parsed: unknown = JSON.parse(savedStats);

        if (!isObject(parsed)) {
            return progress;
        }

        CATEGORIES.forEach((category) => {
            const rawCategory = parsed[category];

            if (!isObject(rawCategory)) {
                return;
            }

            Object.entries(rawCategory).forEach(([levelString, rawAttempts]) => {
                const level = Number(levelString);

                if (
                    !Number.isInteger(level) ||
                    level < 1 ||
                    level > CATEGORY_CONFIG[category].levels ||
                    !Array.isArray(rawAttempts)
                ) {
                    return;
                }

                const passed = rawAttempts.some((rawAttempt) => {
                    if (!isObject(rawAttempt)) {
                        return false;
                    }

                    const percent = rawAttempt.percent;

                    return (
                        typeof percent === "number" &&
                        Number.isFinite(percent) &&
                        percent >= PASS_PERCENT
                    );
                });

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
    const progressFromStatistics = getProgressFromStatistics();

    try {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);

        if (!saved) {
            return progressFromStatistics;
        }

        const parsed: unknown = JSON.parse(saved);

        if (!isObject(parsed)) {
            return progressFromStatistics;
        }

        const progress: UserProgress = {
            ...progressFromStatistics,
        };

        CATEGORIES.forEach((category) => {
            const savedLevel = parsed[category];

            if (
                typeof savedLevel !== "number" ||
                !Number.isInteger(savedLevel) ||
                savedLevel < 1 ||
                savedLevel > CATEGORY_CONFIG[category].levels
            ) {
                return;
            }

            progress[category] = Math.max(progress[category], savedLevel);
        });

        return progress;
    } catch {
        return progressFromStatistics;
    }
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
