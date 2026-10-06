import { useGetProgressQuery, type UserProgress } from "../api/progressApi";
import { useAppSelector } from "../store/hooks";

const GUEST_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

export function useUserProgress() {
    const authStatus = useAppSelector((state) => state.auth.status);
    const isAuthenticated = authStatus === "authenticated";

    const { data, isLoading, isFetching, isError } = useGetProgressQuery(undefined, {
        skip: !isAuthenticated,
    });

    return {
        progress: isAuthenticated && data ? data : GUEST_PROGRESS,
        isProgressLoading:
            authStatus === "checking" || (isAuthenticated && (isLoading || isFetching) && !data),
        isProgressError: authStatus === "error" || (isAuthenticated && isError),
    };
}
