import { useEffect } from "react";

import { useGetCurrentUserQuery } from "../../api/authApi";

import { setAuthenticated, setAuthError, setGuest } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";

function AuthSession() {
    const dispatch = useAppDispatch();
    const { data: user, isSuccess, isError, error } = useGetCurrentUserQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (isSuccess && user) {
            dispatch(setAuthenticated());
            return;
        }

        if (!isError) {
            return;
        }

        if (error && "status" in error && error.status === 401) {
            dispatch(setGuest());
            return;
        }

        dispatch(setAuthError());
    }, [dispatch, error, isError, isSuccess, user]);

    return null;
}

export default AuthSession;
