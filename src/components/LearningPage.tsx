import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useGetVocabularyQuery } from "../api/vocabularyApi";
import { CATEGORY_CONFIG, isCategory } from "../config/categories";
import { useUserProgress } from "../hooks/useUserProgress";

import CardList from "./CardList";
import { Test } from "./Test";

type LearningPageProps = {
    testMode?: boolean;
};

function LearningPage({ testMode = false }: LearningPageProps) {
    const navigate = useNavigate();
    const { progress, isProgressLoading, isProgressError } = useUserProgress();
    const { category: categoryParam, level: levelParam } = useParams();

    const category = isCategory(categoryParam) ? categoryParam : null;
    const level = Number(levelParam);

    const validLevel = Number.isInteger(level) && level >= 1;
    const maxLevel = category ? CATEGORY_CONFIG[category].levels : 1;
    const levelInRange = validLevel && level <= maxLevel;
    const highestUnlockedLevel = category ? Math.min(progress[category], maxLevel) : 1;
    const unlocked = levelInRange && level <= highestUnlockedLevel;

    const {
        currentData: cards = [],
        isLoading,
        isFetching,
        isError,
    } = useGetVocabularyQuery(
        {
            category: category ?? "verbs",
            level: levelInRange ? level : 1,
        },
        {
            skip: !category || !levelInRange || isProgressLoading || isProgressError || !unlocked,
        },
    );

    if (!category) {
        return <Navigate to="/verbs/1" replace />;
    }

    const categoryConfig = CATEGORY_CONFIG[category];

    if (!levelInRange) {
        return <Navigate to={`/${category}/1`} replace />;
    }

    if (isProgressLoading) {
        return (
            <>
                <h2 className="level-title">
                    {categoryConfig.title} — Уровень {level}
                </h2>

                <p>Загрузка прогресса...</p>
            </>
        );
    }

    if (isProgressError) {
        return (
            <>
                <h2 className="level-title">
                    {categoryConfig.title} — Уровень {level}
                </h2>

                <p>Не удалось загрузить прогресс. Проверьте соединение с сервером.</p>
            </>
        );
    }

    if (!unlocked) {
        return <Navigate to={`/${category}/${highestUnlockedLevel}`} replace />;
    }

    if (isLoading || isFetching) {
        return (
            <>
                <h2 className="level-title">
                    {categoryConfig.title} — Уровень {level}
                </h2>

                <p>Загрузка...</p>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <h2 className="level-title">
                    {categoryConfig.title} — Уровень {level}
                </h2>

                <p>Не удалось загрузить слова.</p>
            </>
        );
    }

    return (
        <>
            <h2 className="level-title">
                {categoryConfig.title} — Уровень {level}
            </h2>

            {testMode ? (
                <Test
                    key={`${category}-${level}`}
                    words={cards}
                    category={category}
                    level={level}
                    isLastLevel={level === maxLevel}
                    onBackToCards={() => navigate(`/${category}/${level}`)}
                />
            ) : (
                <CardList
                    key={`${category}-${level}`}
                    cards={cards}
                    category={category}
                    onStartTest={() => navigate(`/${category}/${level}/test`)}
                />
            )}
        </>
    );
}

export default LearningPage;
