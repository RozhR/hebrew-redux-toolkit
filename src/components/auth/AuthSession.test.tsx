import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { setAuthenticated, setAuthError, setGuest } from "../../store/authSlice";

import AuthSession from "./AuthSession";

const mocks = vi.hoisted(() => ({
    dispatch: vi.fn(),

    queryResult: {
        data: undefined as
            | {
                  id: number;
                  email: string;
                  first_name: string;
                  last_name: string;
                  created_at: string;
                  updated_at: string;
              }
            | undefined,

        isSuccess: false,
        isError: false,
        error: undefined as unknown,
    },
}));

vi.mock("../../store/hooks", () => ({
    useAppDispatch: () => mocks.dispatch,
}));

vi.mock("../../api/authApi", () => ({
    useGetCurrentUserQuery: () => mocks.queryResult,
}));

describe("AuthSession", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.queryResult = {
            data: undefined,
            isSuccess: false,
            isError: false,
            error: undefined,
        };
    });

    test("sets authenticated status when current user is loaded", async () => {
        mocks.queryResult = {
            data: {
                id: 1,
                email: "roman@example.com",
                first_name: "Roman",
                last_name: "Rozh",
                created_at: "2026-10-08T00:00:00.000Z",
                updated_at: "2026-10-08T00:00:00.000Z",
            },
            isSuccess: true,
            isError: false,
            error: undefined,
        };

        render(<AuthSession />);

        await waitFor(() => {
            expect(mocks.dispatch).toHaveBeenCalledWith(setAuthenticated());
        });
    });

    test("sets guest status for 401 response", async () => {
        mocks.queryResult = {
            data: undefined,
            isSuccess: false,
            isError: true,
            error: {
                status: 401,
            },
        };

        render(<AuthSession />);

        await waitFor(() => {
            expect(mocks.dispatch).toHaveBeenCalledWith(setGuest());
        });
    });

    test("sets auth error for server error", async () => {
        mocks.queryResult = {
            data: undefined,
            isSuccess: false,
            isError: true,
            error: {
                status: 500,
            },
        };

        render(<AuthSession />);

        await waitFor(() => {
            expect(mocks.dispatch).toHaveBeenCalledWith(setAuthError());
        });
    });
});
