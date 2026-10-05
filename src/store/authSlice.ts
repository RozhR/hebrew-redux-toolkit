import { createSlice } from "@reduxjs/toolkit";

export type AuthStatus = "checking" | "authenticated" | "guest" | "error";

interface AuthState {
    status: AuthStatus;
}

const initialState: AuthState = {
    status: "checking",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated(state) {
            state.status = "authenticated";
        },
        setGuest(state) {
            state.status = "guest";
        },
        setAuthError(state) {
            state.status = "error";
        },
    },
});

export const { setAuthenticated, setGuest, setAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
