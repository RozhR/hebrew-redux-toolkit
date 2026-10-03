import { useEffect } from "react";

import { useGetStatisticsQuery } from "../../api/hebrewApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setStatistics } from "../../store/statisticsSlice";

function AuthStatisticsSync() {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector((state) => state.auth.accessToken);

    const { data: statistics } = useGetStatisticsQuery(undefined, {
        skip: !accessToken,
    });

    useEffect(() => {
        if (statistics) {
            dispatch(setStatistics(statistics));
        }
    }, [dispatch, statistics]);

    return null;
}

export default AuthStatisticsSync;
