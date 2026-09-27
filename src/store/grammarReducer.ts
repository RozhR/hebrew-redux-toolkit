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

const ADD_WORD = "grammar/addWord";
const REMOVE_WORD = "grammar/removeWord";
const CLEAR_GRAMMAR = "grammar/clearGrammar";

type AddWordAction = {
    type: typeof ADD_WORD;
    payload: GrammarWordRef;
};

type RemoveWordAction = {
    type: typeof REMOVE_WORD;
    payload: GrammarWordRef;
};

type ClearGrammarAction = {
    type: typeof CLEAR_GRAMMAR;
};

export type GrammarAction = AddWordAction | RemoveWordAction | ClearGrammarAction;

export function addWord(word: GrammarWordRef): AddWordAction {
    return {
        type: ADD_WORD,
        payload: word,
    };
}

export function removeWord(word: GrammarWordRef): RemoveWordAction {
    return {
        type: REMOVE_WORD,
        payload: word,
    };
}

export function clearGrammar(): ClearGrammarAction {
    return {
        type: CLEAR_GRAMMAR,
    };
}

export function grammarReducer(
    state: GrammarState = initialState,
    action: GrammarAction,
): GrammarState {
    switch (action.type) {
        case ADD_WORD: {
            const exists = state.words.some(
                (word) =>
                    word.category === action.payload.category && word.id === action.payload.id,
            );

            if (exists) {
                return state;
            }

            return {
                ...state,
                words: [...state.words, action.payload],
            };
        }

        case REMOVE_WORD:
            return {
                ...state,
                words: state.words.filter(
                    (word) =>
                        !(
                            word.category === action.payload.category &&
                            word.id === action.payload.id
                        ),
                ),
            };

        case CLEAR_GRAMMAR:
            return {
                ...state,
                words: [],
            };

        default:
            return state;
    }
}
