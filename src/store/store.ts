import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { baseApi } from "../api/baseApi";

import { authReducer } from "./authSlice";
import { guestGrammarReducer } from "./guestGrammarSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        guestGrammar: guestGrammarReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
