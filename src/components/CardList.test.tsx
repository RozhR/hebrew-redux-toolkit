import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import CardList from "./CardList";

vi.mock("./Card", () => ({
    default: ({
        card,
    }: {
        card: {
            id: number;
            hebrew: string;
            russian: string;
        };
    }) => <div>{card.hebrew}</div>,
}));

vi.mock("./GrammarDropZone", () => ({
    default: () => <div>GrammarDropZone</div>,
}));

describe("CardList", () => {
    test("starts test after clicking testing button", async () => {
        const user = userEvent.setup();

        const onStartTest = vi.fn();

        render(
            <CardList
                cards={[
                    {
                        id: 1,
                        hebrew: "שלום",
                        russian: "привет",
                    },
                    {
                        id: 2,
                        hebrew: "תודה",
                        russian: "спасибо",
                    },
                ]}
                category="verbs"
                onStartTest={onStartTest}
            />,
        );

        expect(screen.getByText("שלום")).toBeInTheDocument();
        expect(screen.getByText("תודה")).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Тестирование",
            }),
        );

        expect(onStartTest).toHaveBeenCalledTimes(1);
    });
});
