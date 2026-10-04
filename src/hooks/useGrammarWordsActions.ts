import {
    useAddGrammarWordMutation,
    useClearGrammarWordsMutation,
    useRemoveGrammarWordMutation,
} from "../api/hebrewApi";

import { addWord, clearGrammar, removeWord } from "../store/grammarSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import type { GrammarWordRef } from "../types/grammar";

export function useGrammarWordsActions() {
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector((state) => state.auth.status);

    const words = useAppSelector((state) => state.grammar.words);

    const [addGrammarWordOnServer] = useAddGrammarWordMutation();

    const [removeGrammarWordOnServer] = useRemoveGrammarWordMutation();

    const [clearGrammarWordsOnServer] = useClearGrammarWordsMutation();

    const isAuthenticated = authStatus === "authenticated";

    const addGrammarWord = async (word: GrammarWordRef) => {
        dispatch(addWord(word));

        if (!isAuthenticated) {
            return;
        }

        try {
            await addGrammarWordOnServer(word).unwrap();
        } catch {
            dispatch(removeWord(word));
        }
    };

    const removeGrammarWord = async (word: GrammarWordRef) => {
        dispatch(removeWord(word));

        if (!isAuthenticated) {
            return;
        }

        try {
            await removeGrammarWordOnServer(word).unwrap();
        } catch {
            dispatch(addWord(word));
        }
    };

    const clearAllGrammarWords = async () => {
        const previousWords = [...words];

        dispatch(clearGrammar());

        if (!isAuthenticated) {
            return;
        }

        try {
            await clearGrammarWordsOnServer().unwrap();
        } catch {
            previousWords.forEach((word) => {
                dispatch(addWord(word));
            });
        }
    };

    return {
        addGrammarWord,
        removeGrammarWord,
        clearAllGrammarWords,
    };
}
