import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GrammarWordRef } from "../types/grammar";

export interface GrammarState {
    words: GrammarWordRef[];
}

const initialState: GrammarState = {
    words: [],
};

const grammarSlice = createSlice({
    name: "grammar",

    initialState,

    reducers: {
        setGrammarWords(state, action: PayloadAction<GrammarWordRef[]>) {
            state.words = action.payload;
        },

        addWord(state, action: PayloadAction<GrammarWordRef>) {
            const exists = state.words.some(
                (word) =>
                    word.category === action.payload.category && word.id === action.payload.id,
            );

            if (!exists) {
                state.words.push(action.payload);
            }
        },

        removeWord(state, action: PayloadAction<GrammarWordRef>) {
            state.words = state.words.filter(
                (word) =>
                    !(word.category === action.payload.category && word.id === action.payload.id),
            );
        },

        clearGrammar(state) {
            state.words = [];
        },
    },
});

export const { setGrammarWords, addWord, removeWord, clearGrammar } = grammarSlice.actions;

export const grammarReducer = grammarSlice.reducer;
