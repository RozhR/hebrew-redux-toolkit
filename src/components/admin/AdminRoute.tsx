import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useGetCurrentUserQuery } from "../../api/authApi";
import { useAppSelector } from "../../store/hooks";

interface AdminRouteProps {
    children: ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
    const authStatus = useAppSelector((state) => state.auth.status);

    const {
        data: user,
        isLoading,
        isFetching,
        isError,
    } = useGetCurrentUserQuery(undefined, {
        skip: authStatus !== "authenticated",
    });

    if (authStatus === "checking") {
        return <p>Проверка авторизации...</p>;
    }

    if (authStatus === "guest") {
        return <Navigate to="/login" replace />;
    }

    if (authStatus === "error") {
        return <p>Сервер авторизации недоступен.</p>;
    }

    if (isLoading || isFetching) {
        return <p>Проверка прав доступа...</p>;
    }

    if (isError || !user) {
        return <p>Не удалось проверить права доступа.</p>;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default AdminRoute;
