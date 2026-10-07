import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { clearGuestGrammar } from "../../store/guestGrammarSlice";
import { setAuthenticated } from "../../store/authSlice";

import Login from "./Login";

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    login: vi.fn(),
    unwrap: vi.fn(),
    dispatch: vi.fn(),
    error: undefined as unknown,
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mocks.navigate,
    };
});

vi.mock("../../api/authApi", () => ({
    useLoginMutation: () => [
        mocks.login,
        {
            isLoading: false,
            error: mocks.error,
        },
    ],
}));

vi.mock("../../store/hooks", () => ({
    useAppDispatch: () => mocks.dispatch,
    useAppSelector: () => "guest",
}));

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.error = undefined;

        mocks.login.mockReturnValue({
            unwrap: mocks.unwrap,
        });

        mocks.unwrap.mockResolvedValue({});
    });

    test("logs in user and redirects to home page", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>,
        );

        await user.type(screen.getByLabelText("Email"), "roman@example.com");

        await user.type(screen.getByLabelText("Пароль"), "Test12345!");

        await user.click(
            screen.getByRole("button", {
                name: "Войти",
            }),
        );

        expect(mocks.login).toHaveBeenCalledWith({
            email: "roman@example.com",
            password: "Test12345!",
        });

        expect(mocks.unwrap).toHaveBeenCalled();

        expect(mocks.dispatch).toHaveBeenCalledWith(clearGuestGrammar());

        expect(mocks.dispatch).toHaveBeenCalledWith(setAuthenticated());

        expect(mocks.navigate).toHaveBeenCalledWith("/");
    });

    test("shows invalid credentials message for 401 error", () => {
        mocks.error = {
            status: 401,
        };

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>,
        );

        expect(screen.getByText("Неверный email или пароль.")).toBeInTheDocument();
    });
});
