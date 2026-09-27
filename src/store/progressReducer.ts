import { CATEGORY_CONFIG, CATEGORIES } from "../config/categories";

import { PASS_PERCENT } from "../config/test";

import type { Category, TestStats } from "../types";

export type UserProgress = Record<Category, number>;

const DEFAULT_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

function getProgressFromStatistics(): UserProgress {
    const progress: UserProgress = {
        ...DEFAULT_PROGRESS,
    };

    try {
        const savedStats = localStorage.getItem("testStats");

        if (!savedStats) {
            return progress;
        }

        const stats: TestStats = JSON.parse(savedStats);

        CATEGORIES.forEach((category) => {
            const categoryStats = stats[category];

            if (!categoryStats) {
                return;
            }

            Object.entries(categoryStats).forEach(([levelString, attempts]) => {
                const level = Number(levelString);

                const passed = attempts.some((attempt) => attempt.percent >= PASS_PERCENT);

                if (!passed) {
                    return;
                }

                const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

                progress[category] = Math.max(progress[category], nextLevel);
            });
        });
    } catch {
        return progress;
    }

    return progress;
}

function loadProgress(): UserProgress {
    try {
        const saved = localStorage.getItem("userProgress");

        if (saved) {
            return {
                ...DEFAULT_PROGRESS,
                ...JSON.parse(saved),
            };
        }
    } catch {
        // Используем восстановление из статистики.
    }

    return getProgressFromStatistics();
}

const initialState: UserProgress = loadProgress();

const UNLOCK_NEXT_LEVEL = "progress/unlockNextLevel";

type UnlockNextLevelAction = {
    type: typeof UNLOCK_NEXT_LEVEL;
    payload: {
        category: Category;
        level: number;
    };
};

export type ProgressAction = UnlockNextLevelAction;

export function unlockNextLevel(category: Category, level: number): UnlockNextLevelAction {
    return {
        type: UNLOCK_NEXT_LEVEL,
        payload: {
            category,
            level,
        },
    };
}

export function progressReducer(
    state: UserProgress = initialState,
    action: ProgressAction,
): UserProgress {
    switch (action.type) {
        case UNLOCK_NEXT_LEVEL: {
            const { category, level } = action.payload;

            const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

            if (state[category] >= nextLevel) {
                return state;
            }

            return {
                ...state,
                [category]: nextLevel,
            };
        }

        default:
            return state;
    }
}
