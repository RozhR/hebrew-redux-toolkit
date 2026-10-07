import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { Test } from "./Test";

const mocks = vi.hoisted(() => ({
    addStatistic: vi.fn(),
    unwrap: vi.fn(),
    resetTimer: vi.fn(),
    authStatus: "guest",
}));

vi.mock("../store/hooks", () => ({
    useAppSelector: () => mocks.authStatus,
}));

vi.mock("../api/statisticsApi", () => ({
    useAddStatisticMutation: () => [mocks.addStatistic],
}));

vi.mock("../hooks/useTestTimer", () => ({
    useTestTimer: () => ({
        timeLeft: 15,
        isTimeout: false,
        resetTimer: mocks.resetTimer,
    }),
}));

describe("Test", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.authStatus = "guest";

        mocks.addStatistic.mockReturnValue({
            unwrap: mocks.unwrap,
        });

        mocks.unwrap.mockResolvedValue({});
    });

    test("shows 100 percent result after correct answer for guest", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Test
                    words={[
                        {
                            hebrew: "שלום",
                            russian: "привет",
                        },
                    ]}
                    category="verbs"
                    level={1}
                    isLastLevel={false}
                    onBackToCards={vi.fn()}
                />
            </MemoryRouter>,
        );

        expect(screen.getByText("Вопрос 1 из 1")).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "привет",
            }),
        );

        expect(screen.getByText("Верно!")).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Продолжить →",
            }),
        );

        expect(screen.getByText("Тест завершён")).toBeInTheDocument();

        expect(
            screen.getByText("100%", {
                selector: ".test-result-percent",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Для открытия следующего уровня необходима регистрация."),
        ).toBeInTheDocument();

        expect(mocks.addStatistic).not.toHaveBeenCalled();
    });

    test("saves result for authenticated user", async () => {
        mocks.authStatus = "authenticated";

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Test
                    words={[
                        {
                            hebrew: "שלום",
                            russian: "привет",
                        },
                    ]}
                    category="verbs"
                    level={1}
                    isLastLevel={false}
                    onBackToCards={vi.fn()}
                />
            </MemoryRouter>,
        );

        await user.click(
            screen.getByRole("button", {
                name: "привет",
            }),
        );

        await user.click(
            screen.getByRole("button", {
                name: "Продолжить →",
            }),
        );

        expect(mocks.addStatistic).toHaveBeenCalledWith({
            category: "verbs",
            level: 1,
            correct: 1,
            total: 1,
        });

        expect(mocks.unwrap).toHaveBeenCalled();

        expect(screen.getByText("Тест завершён")).toBeInTheDocument();

        expect(
            screen.getByText("100%", {
                selector: ".test-result-percent",
            }),
        ).toBeInTheDocument();
    });
});
