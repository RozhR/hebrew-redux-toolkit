import { Navigate } from "react-router-dom";

import { useGetCurrentUserQuery } from "../../api/authApi";
import { useAppSelector } from "../../store/hooks";

function Profile() {
    const authStatus = useAppSelector((state) => state.auth.status);

    const {
        data: user,
        isLoading,
        isError,
    } = useGetCurrentUserQuery(undefined, {
        skip: authStatus !== "authenticated",
    });

    if (authStatus === "checking") {
        return (
            <main className="auth-page">
                <div className="auth-card">
                    <p>Проверка авторизации...</p>
                </div>
            </main>
        );
    }

    if (authStatus === "guest") {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <main className="auth-page">
                <div className="auth-card">
                    <p>Загрузка профиля...</p>
                </div>
            </main>
        );
    }

    if (isError || !user) {
        return (
            <main className="auth-page">
                <div className="auth-card">
                    <p className="auth-error">Не удалось загрузить профиль.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="auth-page">
            <div className="auth-card profile-card">
                <h2>Профиль</h2>

                <div className="profile-info">
                    <p>
                        <strong>Имя:</strong> {user.first_name}
                    </p>

                    <p>
                        <strong>Фамилия:</strong> {user.last_name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Profile;
