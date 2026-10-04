import {
    useAddGrammarWordMutation,
    useClearGrammarWordsMutation,
    useRemoveGrammarWordMutation,
} from "../api/hebrewApi";

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

    const [addGrammarWordOnServer] = useAddGrammarWordMutation();

    const [removeGrammarWordOnServer] = useRemoveGrammarWordMutation();

    const [clearGrammarWordsOnServer] = useClearGrammarWordsMutation();

    const isAuthenticated = authStatus === "authenticated";

    const addGrammarWord = async (word: GrammarWordRef) => {
        if (!isAuthenticated) {
            dispatch(addGuestGrammarWord(word));

            return;
        }

        try {
            await addGrammarWordOnServer(word).unwrap();
        } catch {
            /*
             * Ничего откатывать
             * не нужно.
             *
             * Если сервер не
             * сохранил слово,
             * RTK Query cache
             * останется
             * источником истины.
             */
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
            /*
             * Серверное состояние
             * не изменилось —
             * ничего вручную
             * восстанавливать
             * не требуется.
             */
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
            /*
             * Если удаление
             * на сервере
             * не прошло,
             * RTK Query оставит
             * текущие слова.
             */
        }
    };

    return {
        addGrammarWord,
        removeGrammarWord,
        clearAllGrammarWords,
    };
}
