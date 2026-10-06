import { useGetGrammarWordsQuery } from "../api/grammarWordsApi";
import { useAppSelector } from "../store/hooks";

export function useGrammarWords() {
    const authStatus = useAppSelector((state) => state.auth.status);
    const guestWords = useAppSelector((state) => state.guestGrammar.words);
    const isAuthenticated = authStatus === "authenticated";

    const {
        data: serverWords,
        isLoading,
        isFetching,
        isError,
    } = useGetGrammarWordsQuery(undefined, {
        skip: !isAuthenticated,
    });

    if (authStatus === "guest") {
        return {
            words: guestWords,
            isLoading: false,
            isError: false,
        };
    }

    if (authStatus === "error") {
        return {
            words: [],
            isLoading: false,
            isError: true,
        };
    }

    if (isAuthenticated) {
        return {
            words: serverWords ?? [],
            isLoading: !serverWords && (isLoading || isFetching),
            isError,
        };
    }

    return {
        words: [],
        isLoading: true,
        isError: false,
    };
}
