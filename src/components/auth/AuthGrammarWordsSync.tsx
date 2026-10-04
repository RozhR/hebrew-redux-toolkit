import { useEffect } from "react";

import { useGetGrammarWordsQuery } from "../../api/hebrewApi";

import { clearGrammar, setGrammarWords } from "../../store/grammarSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

function AuthGrammarWordsSync() {
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector((state) => state.auth.status);

    const { data: words } = useGetGrammarWordsQuery(undefined, {
        skip: authStatus !== "authenticated",
    });

    useEffect(() => {
        if (authStatus === "guest") {
            dispatch(clearGrammar());

            return;
        }

        if (authStatus === "authenticated" && words) {
            dispatch(setGrammarWords(words));
        }
    }, [authStatus, dispatch, words]);

    return null;
}

export default AuthGrammarWordsSync;
