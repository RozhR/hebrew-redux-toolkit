import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Card from "./Card";

const mocks = vi.hoisted(() => ({
    addGrammarWord: vi.fn(),
    removeGrammarWord: vi.fn(),
}));

vi.mock("../hooks/useGrammarWords", () => ({
    useGrammarWords: () => ({
        words: [],
    }),
}));

vi.mock("../hooks/useGrammarWordsActions", () => ({
    useGrammarWordsActions: () => ({
        addGrammarWord: mocks.addGrammarWord,
        removeGrammarWord: mocks.removeGrammarWord,
    }),
}));

describe("Card", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation(() => ({
                matches: false,
                media: "",
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    test("flips card after click", () => {
        const { container } = render(
            <Card
                category="verbs"
                card={{
                    id: 1,
                    hebrew: "ללמוד",
                    russian: "учить",
                }}
            />,
        );

        expect(screen.getByText("ללמוד")).toBeInTheDocument();
        expect(screen.getByText("учить")).toBeInTheDocument();

        const card = container.querySelector(".card");

        expect(card).not.toBeNull();
        expect(card).not.toHaveClass("flipped");

        fireEvent.click(card!);

        expect(card).toHaveClass("flipped");
    });
});
