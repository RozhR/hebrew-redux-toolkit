import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { GrammarWordRef } from "../types/grammar";

const STORAGE_KEY = "grammarWords";

export interface GrammarState {
    words: GrammarWordRef[];
}

function loadGrammarWords(): GrammarWordRef[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return [];
        }

        const parsed: unknown = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((item): item is GrammarWordRef => {
            if (typeof item !== "object" || item === null) {
                return false;
            }

            const word = item as Record<string, unknown>;

            const validCategory =
                word.category === "verbs" ||
                word.category === "adjectives" ||
                word.category === "adverbs";

            return validCategory && typeof word.id === "number" && Number.isInteger(word.id);
        });
    } catch {
        return [];
    }
}

const initialState: GrammarState = {
    words: loadGrammarWords(),
};

const grammarSlice = createSlice({
    name: "grammar",

    initialState,

    reducers: {
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

export const { addWord, removeWord, clearGrammar } = grammarSlice.actions;

export const grammarReducer = grammarSlice.reducer;
