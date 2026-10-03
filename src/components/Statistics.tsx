import { CATEGORIES, CATEGORY_CONFIG } from "../config/categories";

import { clearGrammarTestStatistics } from "../store/grammarTestStatisticsSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { clearStatistics } from "../store/statisticsSlice";

import { SECTION_TITLES } from "./grammar/grammarTestUtils";

import { useClearStatisticsMutation } from "../api/hebrewApi";

function Statistics() {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector((state) => state.auth.accessToken);

    const [clearStatisticsOnServer, { isLoading: isClearingStatistics }] =
        useClearStatisticsMutation();

    const stats = useAppSelector((state) => state.statistics);

    const grammarTestStats = useAppSelector((state) => state.grammarTestStatistics);

    const handleClearStatistics = async () => {
        if (!accessToken) {
            dispatch(clearStatistics());

            return;
        }

        try {
            await clearStatisticsOnServer().unwrap();

            dispatch(clearStatistics());
        } catch {
            // Если сервер не очистил статистику,
            // локальные данные тоже оставляем.
        }
    };

    const handleClearGrammarStatistics = () => {
        dispatch(clearGrammarTestStatistics());
    };

    const hasStatistics = CATEGORIES.some(
        (category) => Object.keys(stats[category] ?? {}).length > 0,
    );

    const hasGrammarStatistics = grammarTestStats.length > 0;

    const hasAnyStatistics = hasStatistics || hasGrammarStatistics;

    const bestGrammarAttempt = hasGrammarStatistics
        ? grammarTestStats.reduce((best, current) =>
              current.percent > best.percent ? current : best,
          )
        : null;

    const averageGrammarPercent = hasGrammarStatistics
        ? Math.round(
              grammarTestStats.reduce((sum, attempt) => sum + attempt.percent, 0) /
                  grammarTestStats.length,
          )
        : 0;

    const latestGrammarAttempt = hasGrammarStatistics
        ? grammarTestStats[grammarTestStats.length - 1]
        : null;

    return (
        <div className="statistics-page">
            <h2 className="statistics-title">Статистика</h2>

            {!hasAnyStatistics && (
                <p className="statistics-empty">
                    Статистика пока отсутствует. Пройдите хотя бы один тест.
                </p>
            )}

            {hasStatistics && (
                <div className="statistics-container">
                    {CATEGORIES.map((category) => {
                        const categoryStats = stats[category];

                        const levels = Object.entries(categoryStats ?? {}).sort(
                            ([levelA], [levelB]) => Number(levelA) - Number(levelB),
                        );

                        return (
                            <section className="statistics-category" key={category}>
                                <h3>{CATEGORY_CONFIG[category].title}</h3>

                                {levels.length === 0 ? (
                                    <p className="statistics-no-results">Нет результатов</p>
                                ) : (
                                    levels.map(([level, attempts]) => {
                                        const bestAttempt = attempts.reduce((best, current) =>
                                            current.percent > best.percent ? current : best,
                                        );

                                        const averagePercent = Math.round(
                                            attempts.reduce(
                                                (sum, attempt) => sum + attempt.percent,
                                                0,
                                            ) / attempts.length,
                                        );

                                        const progressClass =
                                            bestAttempt.percent >= 80
                                                ? "progress-good"
                                                : bestAttempt.percent >= 50
                                                  ? "progress-medium"
                                                  : "progress-low";

                                        return (
                                            <div className="statistics-level" key={level}>
                                                <div className="statistics-level-header">
                                                    <strong>Уровень {level}</strong>

                                                    <span>{bestAttempt.percent}%</span>
                                                </div>

                                                <div className="statistics-progress">
                                                    <div
                                                        className={`statistics-progress-fill ${progressClass}`}
                                                        style={{
                                                            width: `${bestAttempt.percent}%`,
                                                        }}
                                                    />
                                                </div>

                                                <p>
                                                    Правильных ответов: {bestAttempt.correct} из{" "}
                                                    {bestAttempt.total}
                                                </p>

                                                <p className="statistics-date">
                                                    Лучшая попытка:{" "}
                                                    {new Date(bestAttempt.date).toLocaleString()}
                                                </p>

                                                <p className="statistics-attempts">
                                                    Попыток: {attempts.length}
                                                    {" · "}
                                                    Средний балл: {averagePercent}%
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </section>
                        );
                    })}
                </div>
            )}

            {hasStatistics && (
                <button
                    type="button"
                    className="styled-btn clear-statistics-btn"
                    onClick={handleClearStatistics}
                    disabled={isClearingStatistics}
                >
                    {isClearingStatistics ? "Очистка..." : "Очистить статистику тестов"}
                </button>
            )}

            {hasGrammarStatistics && bestGrammarAttempt && latestGrammarAttempt && (
                <div className="statistics-container">
                    <section className="statistics-category">
                        <h3>Грамматические тесты</h3>

                        <div className="statistics-level">
                            <div className="statistics-level-header">
                                <strong>Лучший результат</strong>

                                <span>{bestGrammarAttempt.percent}%</span>
                            </div>

                            <div className="statistics-progress">
                                <div
                                    className={`statistics-progress-fill ${
                                        bestGrammarAttempt.percent >= 80
                                            ? "progress-good"
                                            : bestGrammarAttempt.percent >= 50
                                              ? "progress-medium"
                                              : "progress-low"
                                    }`}
                                    style={{
                                        width: `${bestGrammarAttempt.percent}%`,
                                    }}
                                />
                            </div>

                            <p>
                                Правильных ответов в лучшей попытке: {bestGrammarAttempt.correct} из{" "}
                                {bestGrammarAttempt.total}
                            </p>

                            <p className="statistics-attempts">
                                Попыток: {grammarTestStats.length}
                                {" · "}
                                Средний балл: {averageGrammarPercent}%
                            </p>
                        </div>

                        <div className="statistics-level">
                            <div className="statistics-level-header">
                                <strong>Последняя попытка</strong>

                                <span>{latestGrammarAttempt.percent}%</span>
                            </div>

                            <p>
                                Правильных ответов: {latestGrammarAttempt.correct} из{" "}
                                {latestGrammarAttempt.total}
                            </p>

                            <p>
                                Разделы:{" "}
                                {latestGrammarAttempt.sections
                                    .map((section) => SECTION_TITLES[section])
                                    .join(", ")}
                            </p>

                            <p className="statistics-date">
                                Дата: {new Date(latestGrammarAttempt.date).toLocaleString()}
                            </p>
                        </div>
                    </section>
                </div>
            )}

            {hasGrammarStatistics && (
                <button
                    type="button"
                    className="styled-btn clear-statistics-btn"
                    onClick={handleClearGrammarStatistics}
                >
                    Очистить статистику грамматики
                </button>
            )}
        </div>
    );
}

export default Statistics;
