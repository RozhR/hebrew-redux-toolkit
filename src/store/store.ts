import { combineReducers, legacy_createStore as createStore } from "redux";

import { grammarReducer } from "./grammarReducer";
import { statisticsReducer } from "./statisticsReducer";

import { progressReducer } from "./progressReducer";

const GRAMMAR_STORAGE_KEY = "grammarWords";

const STATISTICS_STORAGE_KEY = "testStats";

const PROGRESS_STORAGE_KEY = "userProgress";

const rootReducer = combineReducers({
    grammar: grammarReducer,
    statistics: statisticsReducer,
    progress: progressReducer,
});

export const store = createStore(rootReducer);

store.subscribe(() => {
    const state = store.getState();

    localStorage.setItem(GRAMMAR_STORAGE_KEY, JSON.stringify(state.grammar.words));

    localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(state.statistics));

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state.progress));
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
