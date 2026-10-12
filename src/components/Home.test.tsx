import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Home from "./Home";

describe("Home", () => {
    test("renders main page headings", () => {
        render(<Home />);

        expect(
            screen.getByRole("heading", {
                name: "Ресурс для изучения иврита.",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "При разработке ни один израильтянин не пострадал!",
            }),
        ).toBeInTheDocument();
    });
});
