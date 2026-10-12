import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import AdminRoute from "./AdminRoute";

const mocks = vi.hoisted(() => ({
    useGetCurrentUserQuery: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock("../../api/authApi", () => ({
    useGetCurrentUserQuery: mocks.useGetCurrentUserQuery,
}));

vi.mock("../../store/hooks", () => ({
    useAppSelector: mocks.useAppSelector,
}));

type AuthStatus = "checking" | "authenticated" | "guest" | "error";

function mockAuthStatus(status: AuthStatus) {
    mocks.useAppSelector.mockImplementation(
        (selector: (state: { auth: { status: AuthStatus } }) => unknown) =>
            selector({
                auth: { status },
            }),
    );
}

function mockUser(role: "admin" | "user") {
    mocks.useGetCurrentUserQuery.mockReturnValue({
        data: {
            id: 1,
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            role,
        },
        isLoading: false,
        isFetching: false,
        isError: false,
    });
}

function renderAdminRoute() {
    return render(
        <MemoryRouter initialEntries={["/admin/analytics"]}>
            <Routes>
                <Route
                    path="/admin/analytics"
                    element={
                        <AdminRoute>
                            <div>Admin Dashboard</div>
                        </AdminRoute>
                    }
                />

                <Route path="/login" element={<div>Login Page</div>} />

                <Route path="/" element={<div>Home Page</div>} />
            </Routes>
        </MemoryRouter>,
    );
}

describe("AdminRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.useGetCurrentUserQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
        });
    });

    it("redirects guest to login", () => {
        mockAuthStatus("guest");

        renderAdminRoute();

        expect(screen.getByText("Login Page")).toBeInTheDocument();

        expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    });

    it("redirects regular user to home", () => {
        mockAuthStatus("authenticated");
        mockUser("user");

        renderAdminRoute();

        expect(screen.getByText("Home Page")).toBeInTheDocument();

        expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
    });

    it("allows admin to access dashboard", () => {
        mockAuthStatus("authenticated");
        mockUser("admin");

        renderAdminRoute();

        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });
});
