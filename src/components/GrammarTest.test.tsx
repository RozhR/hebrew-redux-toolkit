import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import GrammarTest from "./GrammarTest";

const mocks = vi.hoisted(() => ({
    save: vi.fn(),
    reset: vi.fn(),
    result: { isLoading: false, isError: false },
}));
vi.mock("../store/hooks", () => ({ useAppSelector: () => "authenticated" }));
vi.mock("../hooks/useGrammarWords", () => ({
    useGrammarWords: () => ({
        words: [{ category: "verbs", id: 1 }],
        isLoading: false,
        isError: false,
    }),
}));
vi.mock("../hooks/useTestTimer", () => ({
    useTestTimer: () => ({ timeLeft: 15, isTimeout: false, resetTimer: vi.fn() }),
}));
vi.mock("../api/grammarApi", () => ({
    useGetVerbGrammarsQuery: () => ({
        data: [{}],
        isLoading: false,
        isFetching: false,
        isError: false,
    }),
}));
vi.mock("../api/statisticsApi", () => ({
    useAddGrammarStatisticMutation: () => [mocks.save, { ...mocks.result, reset: mocks.reset }],
}));
vi.mock("./grammar/grammarTestUtils", () => ({
    GRAMMAR_TEST_SECTIONS: ["present"],
    SECTION_TITLES: { present: "Настоящее" },
    createQuestions: () => [
        {
            id: "1",
            infinitive: "ללמוד",
            translation: "учить",
            sectionTitle: "Настоящее",
            person: "הוא",
            correctAnswer: "לומד",
            answers: ["לומד", "לומדת"],
        },
    ],
}));

describe("grammar result saving", () => {
    test("shows a failed save and retries the same result", async () => {
        const user = userEvent.setup();
        const view = (
            <MemoryRouter>
                <GrammarTest />
            </MemoryRouter>
        );
        const { rerender } = render(view);
        await user.click(screen.getByRole("button", { name: "Начать тест" }));
        await user.click(screen.getByRole("button", { name: "לומד" }));
        await user.click(screen.getByRole("button", { name: "Завершить" }));
        expect(mocks.save).toHaveBeenCalledWith({
            correct: 1,
            total: 1,
            sections: ["present", "past", "future"],
        });
        mocks.result = { isLoading: false, isError: true };
        rerender(
            <MemoryRouter>
                <GrammarTest />
            </MemoryRouter>,
        );
        expect(screen.getByRole("alert")).toHaveTextContent("Не удалось сохранить результат");
        await user.click(screen.getByRole("button", { name: "Повторить сохранение" }));
        expect(mocks.save).toHaveBeenCalledTimes(2);
        expect(mocks.save.mock.calls[1]).toEqual(mocks.save.mock.calls[0]);
    });
});
