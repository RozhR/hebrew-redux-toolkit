import { useEffect } from "react";

import { useGetStatisticsQuery } from "../../api/hebrewApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setStatistics } from "../../store/statisticsSlice";

function AuthStatisticsSync() {
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector((state) => state.auth.status);

    const { data: statistics } = useGetStatisticsQuery(undefined, {
        skip: authStatus !== "authenticated",
    });

    useEffect(() => {
        if (statistics) {
            dispatch(setStatistics(statistics));
        }
    }, [dispatch, statistics]);

    return null;
}

export default AuthStatisticsSync;
