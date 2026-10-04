import { useGetProgressQuery } from "../api/hebrewApi";
import { useAppSelector } from "../store/hooks";

import type { UserProgress } from "../api/hebrewApi";

const GUEST_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

export function useUserProgress() {
    const authStatus = useAppSelector((state) => state.auth.status);

    const isAuthenticated = authStatus === "authenticated";

    const { data, isLoading, isFetching } = useGetProgressQuery(undefined, {
        skip: !isAuthenticated,
    });

    const progress = isAuthenticated && data ? data : GUEST_PROGRESS;

    const isProgressLoading =
        authStatus === "checking" || (isAuthenticated && (isLoading || isFetching) && !data);

    return {
        progress,
        isProgressLoading,
    };
}
