import { configureStore } from "@reduxjs/toolkit";

import { hebrewApi } from "../api/hebrewApi";

import { authReducer } from "./authSlice";
import { guestGrammarReducer } from "./guestGrammarSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,

        guestGrammar: guestGrammarReducer,

        [hebrewApi.reducerPath]: hebrewApi.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(hebrewApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
