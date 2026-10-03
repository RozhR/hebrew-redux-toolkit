import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useLoginMutation } from "../../api/hebrewApi";

import { setAccessToken } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const accessToken = useAppSelector((state) => state.auth.accessToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [login, { isLoading, error }] = useLoginMutation();

    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const result = await login({
                email,
                password,
            }).unwrap();

            dispatch(setAccessToken(result.accessToken));

            navigate("/");
        } catch {
            // RTK Query хранит ошибку в error.
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

                    {error && <p className="auth-error">Неверный email или пароль.</p>}

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
