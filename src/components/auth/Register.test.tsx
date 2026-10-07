import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Register from "./Register";

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    register: vi.fn(),
    unwrap: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mocks.navigate,
    };
});

vi.mock("../../api/authApi", () => ({
    useRegisterMutation: () => [
        mocks.register,
        {
            isLoading: false,
            error: undefined,
        },
    ],
}));

describe("Register", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.register.mockReturnValue({
            unwrap: mocks.unwrap,
        });

        mocks.unwrap.mockResolvedValue({});
    });

    test("submits registration data and redirects to login", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>,
        );

        await user.type(screen.getByLabelText("Имя"), "Roman");
        await user.type(screen.getByLabelText("Фамилия"), "Rozh");
        await user.type(screen.getByLabelText("Email"), "roman@example.com");
        await user.type(screen.getByLabelText("Пароль"), "Test12345!");

        await user.click(
            screen.getByRole("button", {
                name: "Зарегистрироваться",
            }),
        );

        expect(mocks.register).toHaveBeenCalledWith({
            email: "roman@example.com",
            password: "Test12345!",
            firstName: "Roman",
            lastName: "Rozh",
        });

        expect(mocks.unwrap).toHaveBeenCalled();

        expect(mocks.navigate).toHaveBeenCalledWith("/login");
    });
});
