import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GrammarWordRef } from "../types/grammar";

interface GuestGrammarState {
    words: GrammarWordRef[];
}

const initialState: GuestGrammarState = {
    words: [],
};

const guestGrammarSlice = createSlice({
    name: "guestGrammar",

    initialState,

    reducers: {
        addGuestGrammarWord(state, action: PayloadAction<GrammarWordRef>) {
            const exists = state.words.some(
                (word) =>
                    word.category === action.payload.category && word.id === action.payload.id,
            );

            if (!exists) {
                state.words.push(action.payload);
            }
        },

        removeGuestGrammarWord(state, action: PayloadAction<GrammarWordRef>) {
            state.words = state.words.filter(
                (word) =>
                    !(word.category === action.payload.category && word.id === action.payload.id),
            );
        },

        clearGuestGrammar(state) {
            state.words = [];
        },
    },
});

export const { addGuestGrammarWord, removeGuestGrammarWord, clearGuestGrammar } =
    guestGrammarSlice.actions;

export const guestGrammarReducer = guestGrammarSlice.reducer;
