import { useEffect } from "react";

import { useGetCurrentUserQuery } from "../../api/hebrewApi";
import { setAuthenticated, setGuest } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";

function AuthSession() {
    const dispatch = useAppDispatch();

    const { data: user, isSuccess, isError } = useGetCurrentUserQuery();

    useEffect(() => {
        if (isSuccess && user) {
            dispatch(setAuthenticated());

            return;
        }

        if (isError) {
            dispatch(setGuest());
        }
    }, [dispatch, isError, isSuccess, user]);

    return null;
}

export default AuthSession;
