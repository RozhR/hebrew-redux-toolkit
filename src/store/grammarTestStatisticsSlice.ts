import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GrammarTestAttempt } from "../components/grammar/grammarTestUtils";

const STORAGE_KEY = "grammarTestStats";

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

        return parsed as GrammarTestAttempt[];
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
