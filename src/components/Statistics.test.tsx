import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Statistics from "./Statistics";

const mocks = vi.hoisted(() => ({
    authStatus: "authenticated",
    statistics: {},
    grammarStatistics: [],
    loadError: false,
    refetch: vi.fn(),
}));

vi.mock("../store/hooks", () => ({
    useAppSelector: () => mocks.authStatus,
}));

vi.mock("../api/statisticsApi", () => ({
    useGetStatisticsQuery: () => ({
        data: mocks.statistics,
        isLoading: false,
        isError: mocks.loadError,
        refetch: mocks.refetch,
    }),

    useGetGrammarStatisticsQuery: () => ({
        data: mocks.grammarStatistics,
        isLoading: false,
    }),

    useClearStatisticsMutation: () => [
        vi.fn(),
        {
            isLoading: false,
        },
    ],

    useClearGrammarStatisticsMutation: () => [
        vi.fn(),
        {
            isLoading: false,
        },
    ],
}));

describe("Statistics", () => {
    beforeEach(() => {
        mocks.authStatus = "authenticated";
        mocks.loadError = false;
        mocks.refetch.mockClear();
        mocks.statistics = {};
        mocks.grammarStatistics = [];
    });

    test("shows empty message when there are no statistics", () => {
        render(<Statistics />);

        expect(
            screen.getByText("Статистика пока отсутствует. Пройдите хотя бы один тест."),
        ).toBeInTheDocument();
    });

    test("shows loading error instead of empty results", () => {
        mocks.loadError = true;
        render(<Statistics />);
        expect(screen.getByRole("alert")).toHaveTextContent("Не удалось загрузить статистику");
        expect(
            screen.queryByText("Статистика пока отсутствует. Пройдите хотя бы один тест."),
        ).not.toBeInTheDocument();
    });

    test("shows vocabulary test statistics", () => {
        mocks.statistics = {
            verbs: {
                1: [
                    {
                        percent: 100,
                        correct: 20,
                        total: 20,
                        date: "2026-10-08T00:00:00.000Z",
                    },
                ],
            },
        };

        render(<Statistics />);

        expect(
            screen.getByRole("heading", {
                name: "Глаголы",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("Уровень 1")).toBeInTheDocument();

        expect(screen.getByText("Правильных ответов: 20 из 20")).toBeInTheDocument();

        expect(screen.getByText("Попыток: 1 · Средний балл: 100%")).toBeInTheDocument();
    });
});
