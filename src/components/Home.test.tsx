import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Home from "./Home";

const { mockGrammarWords, mockUserProgress } = vi.hoisted(() => ({
    mockGrammarWords: vi.fn(),
    mockUserProgress: vi.fn(),
}));

vi.mock("../hooks/useGrammarWords", () => ({ useGrammarWords: mockGrammarWords }));
vi.mock("../hooks/useUserProgress", () => ({ useUserProgress: mockUserProgress }));

function renderHome() {
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/grammar/test" element={<h1>Тест выбранных глаголов</h1>} />
                <Route path="/verbs/4" element={<h1>Глаголы — уровень 4</h1>} />
            </Routes>
        </MemoryRouter>,
    );
}

describe("Home", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockGrammarWords.mockReturnValue({ words: [], isLoading: false, isError: false });
        mockUserProgress.mockReturnValue({
            progress: { verbs: 4, adjectives: 2, adverbs: 1 },
            isProgressLoading: false,
            isProgressError: false,
        });
    });

    test("shows a responsive learning overview and a link to the first level", () => {
        renderHome();

        expect(
            screen.getByRole("heading", { name: /Изучение иврита с карточками и тестами/ }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Начать обучение/ })).toHaveAttribute(
            "href",
            "/verbs/1",
        );
        expect(
            screen.getByRole("heading", { name: "Возможности Hebrew Learning" }),
        ).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: /Открыть грамматику/ })).not.toBeInTheDocument();
        expect(
            screen.queryByText("Выберите слово, чтобы перейти к его грамматическому разбору."),
        ).not.toBeInTheDocument();
        expect(screen.queryByText("01")).not.toBeInTheDocument();
        expect(screen.queryByText("02")).not.toBeInTheDocument();
        expect(screen.getByText(/Расширяйте свой словарный запас/)).toBeInTheDocument();
        expect(screen.queryByText("Рекомендуемое сегодня")).not.toBeInTheDocument();
    });

    test("shows non-clickable word counts and a link to the highest unlocked verb level", () => {
        renderHome();

        expect(screen.getByRole("heading", { name: "Изучение слов" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Изучение слов" })).toHaveAttribute(
            "href",
            "/verbs/4",
        );
        expect(screen.getAllByText("500", { selector: "strong" })).toHaveLength(2);
        expect(screen.getByText("глаголов", { selector: "span" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: /500/ })).not.toBeInTheDocument();
    });

    test("opens the last unlocked verb level from the sidebar heading", async () => {
        renderHome();

        await userEvent.click(screen.getByRole("link", { name: "Изучение слов" }));

        expect(screen.getByRole("heading", { name: "Глаголы — уровень 4" })).toBeInTheDocument();
    });

    test("keeps the learning link unavailable until progress is loaded", () => {
        mockUserProgress.mockReturnValue({
            progress: { verbs: 1, adjectives: 1, adverbs: 1 },
            isProgressLoading: true,
            isProgressError: false,
        });
        renderHome();

        expect(screen.queryByRole("link", { name: "Изучение слов" })).not.toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Изучение слов" })).toBeInTheDocument();
    });

    test("opens the selected-verb grammar test when verbs have been saved", async () => {
        mockGrammarWords.mockReturnValue({
            words: [
                { category: "verbs", id: 8 },
                { category: "adjectives", id: 11 },
            ],
            isLoading: false,
            isError: false,
        });
        renderHome();

        await userEvent.click(screen.getByRole("button", { name: "Тесты" }));

        expect(
            screen.getByRole("heading", { name: "Тест выбранных глаголов" }),
        ).toBeInTheDocument();
    });

    test("warns if there are no selected verbs, then goes to the last unlocked verb level", async () => {
        mockGrammarWords.mockReturnValue({
            words: [{ category: "adjectives", id: 3 }],
            isLoading: false,
            isError: false,
        });
        const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
        renderHome();

        await userEvent.click(screen.getByRole("button", { name: "Тесты" }));

        expect(alert).toHaveBeenCalledWith("Выберите слово для тестирования");
        expect(screen.getByRole("heading", { name: "Глаголы — уровень 4" })).toBeInTheDocument();
    });

    test("does not treat unloaded selected words as an empty selection", () => {
        mockGrammarWords.mockReturnValue({ words: [], isLoading: true, isError: false });
        renderHome();

        expect(screen.getByRole("button", { name: "Тесты" })).toBeDisabled();
    });
});
