import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import Home from "./Home";

describe("Home", () => {
    test("introduces the learning app and links to the first level", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        );

        expect(
            screen.getByRole("heading", {
                name: "Изучайте иврит онлайн с карточками и тестами",
            }),
        ).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Начать обучение" })).toHaveAttribute(
            "href",
            "/verbs/1",
        );

        expect(screen.getByRole("link", { name: "Учить прилагательные" })).toHaveAttribute(
            "href",
            "/adjectives/1",
        );

        expect(screen.getByRole("link", { name: "Учить наречия" })).toHaveAttribute(
            "href",
            "/adverbs/1",
        );

        expect(
            screen.getByText("При разработке ни один израильтянин не пострадал!"),
        ).toBeInTheDocument();
    });
});
