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
    const authStatus = useAppSelector((state) => state.auth.status);

    const isAuthenticated = authStatus === "authenticated";

    const [addGrammarWordOnServer] = useAddGrammarWordMutation();
    const [removeGrammarWordOnServer] = useRemoveGrammarWordMutation();
    const [clearGrammarWordsOnServer] = useClearGrammarWordsMutation();

    const addGrammarWord = async (word: GrammarWordRef) => {
        if (authStatus === "guest") {
            dispatch(addGuestGrammarWord(word));
            return;
        }

        if (!isAuthenticated) {
            return;
        }

        try {
            await addGrammarWordOnServer(word).unwrap();
        } catch {
            return;
        }
    };

    const removeGrammarWord = async (word: GrammarWordRef) => {
        if (authStatus === "guest") {
            dispatch(removeGuestGrammarWord(word));
            return;
        }

        if (!isAuthenticated) {
            return;
        }

        try {
            await removeGrammarWordOnServer(word).unwrap();
        } catch {
            return;
        }
    };

    const clearAllGrammarWords = async () => {
        if (authStatus === "guest") {
            dispatch(clearGuestGrammar());
            return;
        }

        if (!isAuthenticated) {
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
