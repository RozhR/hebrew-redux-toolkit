import { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { hebrewApi, useGetCurrentUserQuery, useLogoutMutation } from "../api/hebrewApi";

import { CATEGORY_CONFIG, CATEGORIES } from "../config/categories";

import { setGuest } from "../store/authSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { resetProgress } from "../store/progressSlice";
import { clearStatistics } from "../store/statisticsSlice";

import type { Category } from "../types";

function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [openCategory, setOpenCategory] = useState<Category | null>(null);

    const count = useAppSelector((state) => state.grammar.words.length);

    const progress = useAppSelector((state) => state.progress);

    const authStatus = useAppSelector((state) => state.auth.status);

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

            dispatch(resetProgress());

            dispatch(clearStatistics());

            dispatch(hebrewApi.util.resetApiState());

            closeMenu();

            navigate("/");
        } catch {
            // Если logout на сервере не прошёл,
            // локальную сессию не очищаем.
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
