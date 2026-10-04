import { useEffect } from "react";

import { useGetProgressQuery } from "../../api/hebrewApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setProgress } from "../../store/progressSlice";

function AuthProgressSync() {
    const dispatch = useAppDispatch();

    const authStatus = useAppSelector((state) => state.auth.status);

    const { data: progress } = useGetProgressQuery(undefined, {
        skip: authStatus !== "authenticated",
    });

    useEffect(() => {
        if (progress) {
            dispatch(setProgress(progress));
        }
    }, [dispatch, progress]);

    return null;
}

export default AuthProgressSync;
