import { useState } from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useGetAdminAnalyticsQuery } from "../../api/adminApi";

type Category = "verbs" | "adjectives" | "adverbs";

const categoryNames: Record<Category, string> = {
    verbs: "Глаголы",
    adjectives: "Прилагательные",
    adverbs: "Наречия",
};

const chartColors = {
    primary: "var(--color-primary-light)",
    secondary: "var(--color-primary-soft)",
    text: "var(--color-text-muted)",
    background: "var(--color-bg-dark)",
    border: "var(--color-bg-light)",
};

function formatDate(date: string) {
    const [, month, day] = date.split("-");
    return `${day}.${month}`;
}

function AdminAnalytics() {
    const [selectedCategory, setSelectedCategory] = useState<Category>("verbs");

    const { data, isLoading, isFetching, isError, refetch } = useGetAdminAnalyticsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    if (isLoading) {
        return (
            <main className="admin-page">
                <p>Загрузка аналитики...</p>
            </main>
        );
    }

    if (isError || !data) {
        return (
            <main className="admin-page">
                <h1>Аналитика сайта</h1>
                <p>Не удалось загрузить данные.</p>

                <button type="button" onClick={() => refetch()}>
                    Повторить
                </button>
            </main>
        );
    }

    const totalTests = data.total_tests + data.total_grammar_tests;

    const averageScore =
        data.average_score === null ? "Нет данных" : `${Number(data.average_score).toFixed(1)}%`;

    const metrics = [
        {
            title: "Всего пользователей",
            value: data.total_users,
        },
        {
            title: "Новых за 7 дней",
            value: data.new_users_7d,
        },
        {
            title: "Новых за 30 дней",
            value: data.new_users_30d,
        },
        {
            title: "Активных за 7 дней",
            value: data.active_users_7d,
        },
        {
            title: "Активных за 30 дней",
            value: data.active_users_30d,
        },
        {
            title: "Всего тестов",
            value: totalTests,
        },
        {
            title: "Тестов сегодня",
            value: data.tests_today,
        },
        {
            title: "Средний результат",
            value: averageScore,
        },
    ];

    const registrations = data.registrations.map((item) => ({
        date: formatDate(item.date),
        count: item.count,
    }));

    const testActivity = data.test_activity.map((item) => ({
        date: formatDate(item.date),
        count: item.count,
    }));

    const categories = data.categories.map((item) => ({
        category: categoryNames[item.category as Category] ?? item.category,
        total: item.total_tests,
        score: Number(item.average_score ?? 0),
    }));

    const levels = data.levels
        .filter((item) => item.category === selectedCategory)
        .map((item) => ({
            level: String(item.level),
            users: item.users,
        }));

    const tooltipStyle = {
        backgroundColor: chartColors.background,
        border: `1px solid ${chartColors.border}`,
        borderRadius: "8px",
        color: "var(--color-text)",
    };

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <h1>Аналитика сайта</h1>
                    <p>Статистика Hebrew Learning</p>
                </div>

                <button type="button" onClick={() => refetch()} disabled={isFetching}>
                    {isFetching ? "Обновление..." : "Обновить"}
                </button>
            </header>

            <section className="admin-metrics">
                {metrics.map((metric) => (
                    <article key={metric.title} className="admin-metric-card">
                        <h2>{metric.title}</h2>
                        <p>{metric.value}</p>
                    </article>
                ))}
            </section>

            <section className="admin-charts">
                <article className="admin-chart-card">
                    <h2>Регистрации за 30 дней</h2>

                    <div className="admin-chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={registrations}>
                                <CartesianGrid stroke={chartColors.border} strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    stroke={chartColors.text}
                                    tick={{ fontSize: 12 }}
                                    minTickGap={20}
                                />

                                <YAxis stroke={chartColors.text} allowDecimals={false} width={35} />

                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    labelStyle={{
                                        color: chartColors.secondary,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    name="Регистрации"
                                    stroke={chartColors.primary}
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="admin-chart-card">
                    <h2>Тестирование за 30 дней</h2>

                    <div className="admin-chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={testActivity}>
                                <CartesianGrid stroke={chartColors.border} strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    stroke={chartColors.text}
                                    tick={{ fontSize: 12 }}
                                    minTickGap={20}
                                />

                                <YAxis stroke={chartColors.text} allowDecimals={false} width={35} />

                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    labelStyle={{
                                        color: chartColors.secondary,
                                    }}
                                />

                                <Bar
                                    dataKey="count"
                                    name="Тесты"
                                    fill={chartColors.primary}
                                    radius={[5, 5, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="admin-chart-card">
                    <h2>Средний результат по категориям</h2>

                    <div className="admin-chart-container">
                        {categories.length === 0 ? (
                            <p className="admin-chart-empty">Пока нет данных</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categories}>
                                    <CartesianGrid
                                        stroke={chartColors.border}
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="category"
                                        stroke={chartColors.text}
                                        tick={{ fontSize: 11 }}
                                        interval={0}
                                    />

                                    <YAxis stroke={chartColors.text} domain={[0, 100]} width={35} />

                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={{
                                            color: chartColors.secondary,
                                        }}
                                        formatter={(value) => [`${value}%`, "Средний балл"]}
                                    />

                                    <Bar
                                        dataKey="score"
                                        name="Средний балл"
                                        fill={chartColors.primary}
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </article>

                <article className="admin-chart-card">
                    <div className="admin-chart-heading">
                        <h2>Достигнутые уровни</h2>

                        <select
                            aria-label="Категория уровней"
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(event.target.value as Category)
                            }
                        >
                            <option value="verbs">Глаголы</option>
                            <option value="adjectives">Прилагательные</option>
                            <option value="adverbs">Наречия</option>
                        </select>
                    </div>

                    <div className="admin-chart-container">
                        {levels.length === 0 ? (
                            <p className="admin-chart-empty">Пока нет данных</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={levels}>
                                    <CartesianGrid
                                        stroke={chartColors.border}
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="level" stroke={chartColors.text} />

                                    <YAxis
                                        stroke={chartColors.text}
                                        allowDecimals={false}
                                        width={35}
                                    />

                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={{
                                            color: chartColors.secondary,
                                        }}
                                    />

                                    <Bar
                                        dataKey="users"
                                        name="Пользователи"
                                        fill={chartColors.primary}
                                        radius={[5, 5, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <p className="admin-chart-note">
                        Показано количество пользователей, разблокировавших соответствующий уровень.
                    </p>
                </article>
            </section>
        </main>
    );
}

export default AdminAnalytics;
