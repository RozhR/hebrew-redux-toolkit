import {
    useAddGrammarWordMutation,
    useClearGrammarWordsMutation,
    useRemoveGrammarWordMutation,
} from "../api/grammarWordsApi";

import {
    addGuestGrammarWord,
    clearGuestGrammar,
    removeGuestGrammarWord,
} from "../store/guestGrammarSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import type { GrammarWordRef } from "../types/grammar";

export function useGrammarWordsActions() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");

    const [addGrammarWordOnServer] = useAddGrammarWordMutation();
    const [removeGrammarWordOnServer] = useRemoveGrammarWordMutation();
    const [clearGrammarWordsOnServer] = useClearGrammarWordsMutation();

    const addGrammarWord = async (word: GrammarWordRef) => {
        if (!isAuthenticated) {
            dispatch(addGuestGrammarWord(word));
            return;
        }

        try {
            await addGrammarWordOnServer(word).unwrap();
        } catch {
            return;
        }
    };

    const removeGrammarWord = async (word: GrammarWordRef) => {
        if (!isAuthenticated) {
            dispatch(removeGuestGrammarWord(word));
            return;
        }

        try {
            await removeGrammarWordOnServer(word).unwrap();
        } catch {
            return;
        }
    };

    const clearAllGrammarWords = async () => {
        if (!isAuthenticated) {
            dispatch(clearGuestGrammar());
            return;
        }

        try {
            await clearGrammarWordsOnServer().unwrap();
        } catch {
            return;
        }
    };

    return { addGrammarWord, removeGrammarWord, clearAllGrammarWords };
}
