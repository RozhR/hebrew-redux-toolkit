import { useState, type FormEvent } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { useLoginMutation } from "../../api/authApi";

import { setAuthenticated } from "../../store/authSlice";

import { clearGuestGrammar } from "../../store/guestGrammarSlice";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

function getLoginErrorMessage(error: unknown) {
    if (!error || typeof error !== "object" || !("status" in error)) {
        return "Не удалось выполнить вход. Попробуйте ещё раз.";
    }

    const status = error.status;

    if (status === 401) {
        return "Неверный email или пароль.";
    }

    if (status === "FETCH_ERROR") {
        return "Сервер недоступен. Проверьте соединение и попробуйте ещё раз.";
    }

    if (typeof status === "number" && status >= 500) {
        return "Ошибка сервера. Попробуйте ещё раз позже.";
    }

    return "Не удалось выполнить вход. Проверьте введённые данные.";
}

function Login() {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const authStatus = useAppSelector((state) => state.auth.status);

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [login, { isLoading, error }] = useLoginMutation();

    if (authStatus === "checking") {
        return (
            <main className="auth-page">
                <div className="auth-card">
                    <p>Проверка авторизации...</p>
                </div>
            </main>
        );
    }

    if (authStatus === "authenticated") {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await login({
                email,
                password,
            }).unwrap();

            dispatch(clearGuestGrammar());

            dispatch(setAuthenticated());

            navigate("/");
        } catch {
            return;
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-card">
                <h2>Вход</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Пароль
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>

                    {error && <p className="auth-error">{getLoginErrorMessage(error)}</p>}

                    <button type="submit" className="styled-btn" disabled={isLoading}>
                        {isLoading ? "Вход..." : "Войти"}
                    </button>
                </form>

                <p>
                    Нет аккаунта? <Link to="/register">Регистрация</Link>
                </p>
            </div>
        </main>
    );
}

export default Login;
