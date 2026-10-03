import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { CATEGORY_CONFIG } from "../config/categories";

import type { Category } from "../types";

export type UserProgress = Record<Category, number>;

const DEFAULT_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

const initialState: UserProgress = {
    ...DEFAULT_PROGRESS,
};

type UnlockNextLevelPayload = {
    category: Category;
    level: number;
};

const progressSlice = createSlice({
    name: "progress",

    initialState,

    reducers: {
        setProgress(state, action: PayloadAction<UserProgress>) {
            Object.assign(state, action.payload);
        },

        resetProgress() {
            return {
                ...DEFAULT_PROGRESS,
            };
        },

        unlockNextLevel(state, action: PayloadAction<UnlockNextLevelPayload>) {
            const { category, level } = action.payload;

            const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

            state[category] = Math.max(state[category], nextLevel);
        },
    },
});

export const { setProgress, resetProgress, unlockNextLevel } = progressSlice.actions;

export const progressReducer = progressSlice.reducer;
