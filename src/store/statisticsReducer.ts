import type { Category, TestAttempt, TestStats } from "../types";

const STORAGE_KEY = "testStats";

function loadStatistics(): TestStats {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return {};
        }

        const parsed: unknown = JSON.parse(saved);

        if (typeof parsed !== "object" || parsed === null) {
            return {};
        }

        return parsed as TestStats;
    } catch {
        return {};
    }
}

const initialState: TestStats = loadStatistics();

const ADD_TEST_ATTEMPT = "statistics/addTestAttempt";

const CLEAR_STATISTICS = "statistics/clearStatistics";

type AddTestAttemptAction = {
    type: typeof ADD_TEST_ATTEMPT;
    payload: {
        category: Category;
        level: number;
        attempt: TestAttempt;
    };
};

type ClearStatisticsAction = {
    type: typeof CLEAR_STATISTICS;
};

export type StatisticsAction = AddTestAttemptAction | ClearStatisticsAction;

export function addTestAttempt(
    category: Category,
    level: number,
    attempt: TestAttempt,
): AddTestAttemptAction {
    return {
        type: ADD_TEST_ATTEMPT,
        payload: {
            category,
            level,
            attempt,
        },
    };
}

export function clearStatistics(): ClearStatisticsAction {
    return {
        type: CLEAR_STATISTICS,
    };
}

export function statisticsReducer(
    state: TestStats = initialState,
    action: StatisticsAction,
): TestStats {
    switch (action.type) {
        case ADD_TEST_ATTEMPT: {
            const { category, level, attempt } = action.payload;

            const categoryStats = state[category] ?? {};

            const attempts = categoryStats[level] ?? [];

            return {
                ...state,

                [category]: {
                    ...categoryStats,

                    [level]: [...attempts, attempt],
                },
            };
        }

        case CLEAR_STATISTICS:
            return {};

        default:
            return state;
    }
}
