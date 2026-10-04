import { lazy, Suspense } from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import LearningPage from "./components/LearningPage";
import Navbar from "./components/Navbar";
import Statistics from "./components/Statistics";

import AuthProgressSync from "./components/auth/AuthProgressSync";
import AuthSession from "./components/auth/AuthSession";
import AuthStatisticsSync from "./components/auth/AuthStatisticsSync";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import Register from "./components/auth/Register";

import "./App.css";

const Grammar = lazy(() => import("./components/Grammar"));

const GrammarTest = lazy(() => import("./components/GrammarTest"));

function App() {
    return (
        <>
            <AuthSession />

            <Navbar />

            <AuthProgressSync />

            <AuthStatisticsSync />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/statistics" element={<Statistics />} />

                <Route
                    path="/grammar"
                    element={
                        <Suspense
                            fallback={<div className="grammar-loading">Загрузка грамматики...</div>}
                        >
                            <Grammar />
                        </Suspense>
                    }
                />

                <Route
                    path="/grammar/test"
                    element={
                        <Suspense
                            fallback={<div className="grammar-loading">Загрузка теста...</div>}
                        >
                            <GrammarTest />
                        </Suspense>
                    }
                />

                <Route path="/:category/:level" element={<LearningPage />} />

                <Route path="/:category/:level/test" element={<LearningPage testMode />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
