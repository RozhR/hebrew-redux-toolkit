import { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { useGetCurrentUserQuery, useLogoutMutation } from "../api/authApi";
import { baseApi } from "../api/baseApi";

import { CATEGORY_CONFIG, CATEGORIES } from "../config/categories";

import { useGrammarWords } from "../hooks/useGrammarWords";
import { useUserProgress } from "../hooks/useUserProgress";

import { setGuest } from "../store/authSlice";
import { clearGuestGrammar } from "../store/guestGrammarSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import type { Category } from "../types";

function Navbar() {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [openCategory, setOpenCategory] = useState<Category | null>(null);

    const authStatus = useAppSelector((state) => state.auth.status);

    const { words } = useGrammarWords();

    const { progress } = useUserProgress();

    const count = words.length;

    const isAuthenticated = authStatus === "authenticated";

    const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    const closeMenu = () => {
        setOpenCategory(null);
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();

            dispatch(setGuest());

            dispatch(clearGuestGrammar());

            dispatch(baseApi.util.resetApiState());

            closeMenu();

            navigate("/");
        } catch {
            return;
        }
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <NavLink to="/" className="nav-link" onClick={closeMenu}>
                        Главная
                    </NavLink>
                </li>

                {CATEGORIES.map((category) => {
                    const config = CATEGORY_CONFIG[category];

                    return (
                        <li className="dropdown" key={category} onMouseLeave={closeMenu}>
                            <button
                                type="button"
                                className="dropdown-toggle"
                                onClick={() =>
                                    setOpenCategory(openCategory === category ? null : category)
                                }
                            >
                                {config.title} ▾
                            </button>

                            <ul
                                className={
                                    openCategory === category
                                        ? "styled-dropdown dropdown-menu open"
                                        : "styled-dropdown dropdown-menu"
                                }
                            >
                                {Array.from(
                                    {
                                        length: config.levels,
                                    },
                                    (_, index) => index + 1,
                                ).map((level) => {
                                    const unlocked = level <= progress[category];

                                    return (
                                        <li key={level}>
                                            {unlocked ? (
                                                <NavLink
                                                    to={`/${category}/${level}`}
                                                    className="level-link"
                                                    onClick={closeMenu}
                                                >
                                                    Уровень {level}
                                                </NavLink>
                                            ) : (
                                                <span className="locked-link">
                                                    🔒 Уровень {level}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}

                <li>
                    <NavLink
                        to="/grammar"
                        className="nav-link grammar-nav-link"
                        onClick={closeMenu}
                    >
                        <span>Грамматика</span>

                        <span className="grammar-counter">{count}</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/statistics" className="nav-link" onClick={closeMenu}>
                        Статистика
                    </NavLink>
                </li>

                <li className="auth-section">
                    {authStatus === "checking" ? (
                        <span className="nav-link">...</span>
                    ) : authStatus === "error" ? (
                        <span className="nav-link">Сервер недоступен</span>
                    ) : !isAuthenticated ? (
                        <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                            Войти
                        </NavLink>
                    ) : (
                        <div className="auth-controls">
                            <NavLink
                                to="/profile"
                                className="nav-link auth-nav-link"
                                onClick={closeMenu}
                            >
                                {isUserLoading ? "Профиль" : user?.first_name || "Профиль"}
                            </NavLink>

                            <button
                                type="button"
                                className="logout-btn"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? "Выход..." : "Выйти"}
                            </button>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
