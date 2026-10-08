import { useState } from "react";

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
    const [actionError, setActionError] = useState<string | null>(null);
    const authStatus = useAppSelector((state) => state.auth.status);

    const isAuthenticated = authStatus === "authenticated";

    const [addGrammarWordOnServer] = useAddGrammarWordMutation();
    const [removeGrammarWordOnServer] = useRemoveGrammarWordMutation();
    const [clearGrammarWordsOnServer] = useClearGrammarWordsMutation();

    const addGrammarWord = async (word: GrammarWordRef) => {
        setActionError(null);
        if (authStatus === "guest") {
            dispatch(addGuestGrammarWord(word));
            return true;
        }

        if (!isAuthenticated) {
            setActionError("Не удалось определить состояние авторизации.");
            return false;
        }

        try {
            await addGrammarWordOnServer(word).unwrap();
            return true;
        } catch {
            setActionError("Не удалось добавить слово в грамматику.");
            return false;
        }
    };

    const removeGrammarWord = async (word: GrammarWordRef) => {
        setActionError(null);
        if (authStatus === "guest") {
            dispatch(removeGuestGrammarWord(word));
            return true;
        }

        if (!isAuthenticated) {
            setActionError("Не удалось определить состояние авторизации.");
            return false;
        }

        try {
            await removeGrammarWordOnServer(word).unwrap();
            return true;
        } catch {
            setActionError("Не удалось удалить слово из грамматики.");
            return false;
        }
    };

    const clearAllGrammarWords = async () => {
        setActionError(null);
        if (authStatus === "guest") {
            dispatch(clearGuestGrammar());
            return true;
        }

        if (!isAuthenticated) {
            setActionError("Не удалось определить состояние авторизации.");
            return false;
        }

        try {
            await clearGrammarWordsOnServer().unwrap();
            return true;
        } catch {
            setActionError("Не удалось очистить выбранные слова.");
            return false;
        }
    };

    return { addGrammarWord, removeGrammarWord, clearAllGrammarWords, actionError };
}
