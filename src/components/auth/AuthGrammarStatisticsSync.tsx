import { useEffect } from "react";

import { useGetGrammarStatisticsQuery } from "../../api/hebrewApi";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { setGrammarTestStatistics } from "../../store/grammarTestStatisticsSlice";

function AuthGrammarStatisticsSync() {
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector((state) => state.auth.status);

    const { data: statistics } = useGetGrammarStatisticsQuery(undefined, {
        skip: authStatus !== "authenticated",
    });

    useEffect(() => {
        if (statistics) {
            dispatch(setGrammarTestStatistics(statistics));
        }
    }, [dispatch, statistics]);

    return null;
}

export default AuthGrammarStatisticsSync;
