import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GrammarTestAttempt, GrammarTestSection } from "../types/grammar";

const STORAGE_KEY = "grammarTestStats";

const VALID_SECTIONS: GrammarTestSection[] = ["present", "past", "future", "imperative"];

function isGrammarTestSection(value: unknown): value is GrammarTestSection {
    return typeof value === "string" && VALID_SECTIONS.includes(value as GrammarTestSection);
}

function isGrammarTestAttempt(value: unknown): value is GrammarTestAttempt {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const attempt = value as Record<string, unknown>;

    if (
        typeof attempt.percent !== "number" ||
        !Number.isFinite(attempt.percent) ||
        attempt.percent < 0 ||
        attempt.percent > 100
    ) {
        return false;
    }

    if (
        typeof attempt.correct !== "number" ||
        !Number.isInteger(attempt.correct) ||
        attempt.correct < 0
    ) {
        return false;
    }

    if (
        typeof attempt.total !== "number" ||
        !Number.isInteger(attempt.total) ||
        attempt.total < 0
    ) {
        return false;
    }

    if (attempt.correct > attempt.total) {
        return false;
    }

    if (typeof attempt.date !== "string") {
        return false;
    }

    if (!Array.isArray(attempt.sections)) {
        return false;
    }

    return attempt.sections.every(isGrammarTestSection);
}

function loadGrammarTestStatistics(): GrammarTestAttempt[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return [];
        }

        const parsed: unknown = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(isGrammarTestAttempt);
    } catch {
        return [];
    }
}

const initialState: GrammarTestAttempt[] = loadGrammarTestStatistics();

const grammarTestStatisticsSlice = createSlice({
    name: "grammarTestStatistics",

    initialState,

    reducers: {
        addGrammarTestAttempt(state, action: PayloadAction<GrammarTestAttempt>) {
            state.push(action.payload);
        },

        clearGrammarTestStatistics() {
            return [];
        },
    },
});

export const { addGrammarTestAttempt, clearGrammarTestStatistics } =
    grammarTestStatisticsSlice.actions;

export const grammarTestStatisticsReducer = grammarTestStatisticsSlice.reducer;
