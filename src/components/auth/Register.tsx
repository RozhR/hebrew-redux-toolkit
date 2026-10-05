import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRegisterMutation } from "../../api/authApi";

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [register, { isLoading, error }] = useRegisterMutation();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await register({
                email,
                password,
                firstName,
                lastName,
            }).unwrap();

            navigate("/login");
        } catch {
            return;
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-card">
                <h2>Регистрация</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        Имя
                        <input
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Фамилия
                        <input
                            type="text"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                        />
                    </label>

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
                            minLength={8}
                            required
                        />
                    </label>

                    {error && (
                        <p className="auth-error">
                            Не удалось зарегистрироваться. Проверьте введённые данные.
                        </p>
                    )}

                    <button type="submit" className="styled-btn" disabled={isLoading}>
                        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </button>
                </form>

                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </main>
    );
}

export default Register;
