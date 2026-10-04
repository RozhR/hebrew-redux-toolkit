import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GrammarTestAttempt } from "../types/grammar";

const initialState: GrammarTestAttempt[] = [];

const grammarTestStatisticsSlice = createSlice({
    name: "grammarTestStatistics",

    initialState,

    reducers: {
        setGrammarTestStatistics(state, action: PayloadAction<GrammarTestAttempt[]>) {
            state.splice(0, state.length, ...action.payload);
        },

        addGrammarTestAttempt(state, action: PayloadAction<GrammarTestAttempt>) {
            state.push(action.payload);
        },

        clearGrammarTestStatistics() {
            return [];
        },
    },
});

export const { setGrammarTestStatistics, addGrammarTestAttempt, clearGrammarTestStatistics } =
    grammarTestStatisticsSlice.actions;

export const grammarTestStatisticsReducer = grammarTestStatisticsSlice.reducer;
