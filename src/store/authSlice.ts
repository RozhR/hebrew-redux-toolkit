import { createSlice } from "@reduxjs/toolkit";

export type AuthStatus = "checking" | "authenticated" | "guest";

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

        setChecking(state) {
            state.status = "checking";
        },
    },
});

export const { setAuthenticated, setGuest, setChecking } = authSlice.actions;

export const authReducer = authSlice.reducer;
