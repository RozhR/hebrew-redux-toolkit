import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import CardList from "./CardList";
import { Test } from "./Test";

import { getVocabulary } from "../api/vocabulary";
import { CATEGORY_CONFIG, isCategory } from "../config/categories";

import { useAppSelector } from "../store/hooks";

import type { CardWithId } from "../types";

type LearningPageProps = {
    testMode?: boolean;
};

function LearningPage({ testMode = false }: LearningPageProps) {
    const navigate = useNavigate();

    const progress = useAppSelector((state) => state.progress);

    const { category: categoryParam, level: levelParam } = useParams();

    const category = isCategory(categoryParam) ? categoryParam : null;

    const level = Number(levelParam);

    const [cards, setCards] = useState<CardWithId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!category || !Number.isInteger(level)) {
            return;
        }

        const currentCategory = category;
        const currentLevel = level;

        let isActive = true;

        async function loadCards() {
            try {
                setIsLoading(true);
                setError(null);

                const loadedCards = await getVocabulary(currentCategory, currentLevel);

                if (isActive) {
                    setCards(loadedCards);
                }
            } catch (loadError) {
                if (isActive) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Не удалось загрузить слова",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadCards();

        return () => {
            isActive = false;
        };
    }, [category, level]);

    if (!category) {
        return <Navigate to="/verbs/1" replace />;
    }

    const categoryConfig = CATEGORY_CONFIG[category];

    const maxLevel = categoryConfig.levels;

    if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        return <Navigate to={`/${category}/1`} replace />;
    }

    const highestUnlockedLevel = Math.min(progress[category], maxLevel);

    if (level > highestUnlockedLevel) {
        return <Navigate to={`/${category}/${highestUnlockedLevel}`} replace />;
    }

    if (isLoading) {
        return (
            <>
                <h2 className="level-title">
                    {categoryConfig.title} — Уровень {level}
                </h2>

                <p>Загрузка...</p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h2 className="level-title">
                    {categoryConfig.title} — Уровень {level}
                </h2>

                <p>Ошибка загрузки данных: {error}</p>
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
