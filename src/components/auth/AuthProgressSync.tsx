import { useEffect } from "react";

import { useGetProgressQuery } from "../../api/hebrewApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setProgress } from "../../store/progressSlice";

function AuthProgressSync() {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector((state) => state.auth.accessToken);

    const { data: progress } = useGetProgressQuery(undefined, {
        skip: !accessToken,
    });

    useEffect(() => {
        if (progress) {
            dispatch(setProgress(progress));
        }
    }, [dispatch, progress]);

    return null;
}

export default AuthProgressSync;
