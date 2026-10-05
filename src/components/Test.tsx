import { useState } from "react";

import { Link } from "react-router-dom";

import { useAddStatisticMutation } from "../api/statisticsApi";

import { PASS_PERCENT, TIMER_WARNING_SECONDS } from "../config/test";

import { useTestTimer } from "../hooks/useTestTimer";

import { useAppSelector } from "../store/hooks";

import type { CardData, Category } from "../types";

interface TestProps {
    words: CardData[];
    category: Category;
    level: number;
    isLastLevel: boolean;
    onBackToCards: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function generateAnswers(words: CardData[], currentWord: CardData): string[] {
    const wrongAnswers = Array.from(
        new Set(
            words
                .filter(
                    (word) =>
                        word.hebrew !== currentWord.hebrew && word.russian !== currentWord.russian,
                )
                .map((word) => word.russian),
        ),
    );

    return shuffleArray([currentWord.russian, ...shuffleArray(wrongAnswers).slice(0, 3)]);
}

export function Test({ words, category, level, isLastLevel, onBackToCards }: TestProps) {
    const authStatus = useAppSelector((state) => state.auth.status);

    const isAuthenticated = authStatus === "authenticated";

    const [addStatistic] = useAddStatisticMutation();

    const [testWords, setTestWords] = useState<CardData[]>(() => shuffleArray(words));

    const [currentIndex, setCurrentIndex] = useState(0);

    const [correctAnswers, setCorrectAnswers] = useState(0);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [isFinished, setIsFinished] = useState(false);

    const currentWord = testWords[currentIndex];

    const { timeLeft, isTimeout, resetTimer } = useTestTimer(
        Boolean(currentWord) && selectedAnswer === null && !isFinished,
    );

    const [answers, setAnswers] = useState<string[]>(() => {
        const firstWord = testWords[0];

        return firstWord ? generateAnswers(testWords, firstWord) : [];
    });

    const finishTest = (finalCorrectAnswers: number) => {
        if (isAuthenticated) {
            void addStatistic({
                category,
                level,
                correct: finalCorrectAnswers,
                total: testWords.length,
            });
        }

        setIsFinished(true);
    };

    const restartTest = () => {
        const shuffledWords = shuffleArray(words);

        setTestWords(shuffledWords);

        setCurrentIndex(0);

        setCorrectAnswers(0);

        setSelectedAnswer(null);

        resetTimer();

        setIsFinished(false);

        const firstWord = shuffledWords[0];

        setAnswers(firstWord ? generateAnswers(shuffledWords, firstWord) : []);
    };

    if (!currentWord && !isFinished) {
        return (
            <div className="test-area">
                <p>Нет слов для тестирования</p>
            </div>
        );
    }

    if (isFinished) {
        const percent =
            testWords.length > 0 ? Math.round((correctAnswers / testWords.length) * 100) : 0;

        const passed = percent >= PASS_PERCENT;

        return (
            <div className="test-area">
                <div className="test-result-card">
                    <h3 className="test-result-title">Тест завершён</h3>

                    <div
                        className={
                            passed ? "test-result-percent passed" : "test-result-percent failed"
                        }
                    >
                        {percent}%
                    </div>

                    <p className="test-result-text">
                        Правильных ответов: <strong>{correctAnswers}</strong> из{" "}
                        <strong>{testWords.length}</strong>
                    </p>

                    {passed ? (
                        isAuthenticated ? (
                            <p className="test-result-message passed-message">
                                {isLastLevel
                                    ? "Отличный результат! Вы завершили все уровни этой категории."
                                    : "Отличный результат! Следующий уровень разблокирован."}
                            </p>
                        ) : (
                            <div className="test-registration-message">
                                <p className="test-result-message passed-message">
                                    Отличный результат! Вы набрали <strong>{percent}%</strong>.
                                </p>

                                <p>Для открытия следующего уровня необходима регистрация.</p>

                                <div className="test-registration-actions">
                                    <Link to="/register" className="styled-btn">
                                        Зарегистрироваться
                                    </Link>

                                    <Link to="/login" className="test-login-link">
                                        Уже есть аккаунт? Войти
                                    </Link>
                                </div>
                            </div>
                        )
                    ) : (
                        <p className="test-result-message failed-message">
                            Для прохождения уровня необходимо набрать минимум {PASS_PERCENT}
                            %.
                        </p>
                    )}

                    <div className="test-result-actions">
                        <button type="button" className="styled-btn" onClick={restartTest}>
                            Пройти ещё раз
                        </button>

                        <button type="button" className="styled-btn" onClick={onBackToCards}>
                            Вернуться к карточкам
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const checkAnswer = (answer: string) => {
        if (selectedAnswer !== null || isTimeout) {
            return;
        }

        setSelectedAnswer(answer);

        if (answer === currentWord.russian) {
            setCorrectAnswers((previous) => previous + 1);
        }
    };

    const handleContinue = () => {
        const nextIndex = currentIndex + 1;

        const nextWord = testWords[nextIndex];

        if (!nextWord) {
            finishTest(correctAnswers);

            return;
        }

        setCurrentIndex(nextIndex);

        setAnswers(generateAnswers(testWords, nextWord));

        setSelectedAnswer(null);

        resetTimer();
    };

    const answered = selectedAnswer !== null || isTimeout;

    const isCorrect = selectedAnswer === currentWord.russian;

    const getAnswerClass = (answer: string): string => {
        if (!answered) {
            return "styled-btn answer-btn";
        }

        if (answer === currentWord.russian) {
            return "styled-btn answer-btn correct-answer";
        }

        if (answer === selectedAnswer) {
            return "styled-btn answer-btn wrong-answer";
        }

        return "styled-btn answer-btn";
    };

    const progress = testWords.length > 0 ? ((currentIndex + 1) / testWords.length) * 100 : 0;

    return (
        <div className="test-area">
            <p className="question-number">
                Вопрос {currentIndex + 1} из {testWords.length}
            </p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>

            <div className={timeLeft <= TIMER_WARNING_SECONDS ? "timer timer-warning" : "timer"}>
                ⌛ {timeLeft}
            </div>

            <h3 className="test-word">{currentWord.hebrew}</h3>

            <div className="answers-container">
                {answers.map((answer) => (
                    <button
                        key={answer}
                        type="button"
                        className={getAnswerClass(answer)}
                        onClick={() => checkAnswer(answer)}
                        disabled={answered}
                    >
                        {answer}
                    </button>
                ))}
            </div>

            {answered && (
                <div className="answer-result">
                    {isTimeout ? (
                        <div className="wrong">Время вышло!</div>
                    ) : isCorrect ? (
                        <div className="correct">Верно!</div>
                    ) : (
                        <div className="wrong">Неверно!</div>
                    )}

                    {!isCorrect && (
                        <p className="correct-answer-text">
                            Правильный ответ: <strong>{currentWord.russian}</strong>
                        </p>
                    )}

                    <button
                        type="button"
                        className="styled-btn continue-btn"
                        onClick={handleContinue}
                    >
                        Продолжить →
                    </button>
                </div>
            )}
        </div>
    );
}
