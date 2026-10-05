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

    if (authStatus === "guest" || authStatus === "error") {
        return {
            words: guestWords,
            isLoading: false,
            isError: false,
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
