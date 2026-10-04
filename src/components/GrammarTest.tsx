import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAddGrammarStatisticMutation } from "../api/hebrewApi";

import { getVerbGrammarFromApi } from "../api/verbGrammar";

import { PASS_PERCENT, TEST_TIMER_SECONDS, TIMER_WARNING_SECONDS } from "../config/test";

import { useAppSelector } from "../store/hooks";

import type { GrammarTestSection, VerbGrammar } from "../types/grammar";

import { createQuestions, GRAMMAR_TEST_SECTIONS, SECTION_TITLES } from "./grammar/grammarTestUtils";

import type { GrammarQuestion } from "./grammar/grammarTestUtils";

type QuestionLimit = "10" | "20" | "all";

function GrammarTest() {
    const navigate = useNavigate();

    const words = useAppSelector((state) => state.grammar.words);

    const authStatus = useAppSelector((state) => state.auth.status);

    const isAuthenticated = authStatus === "authenticated";

    const [addGrammarStatistic] = useAddGrammarStatisticMutation();

    const verbWords = words.filter((word) => word.category === "verbs");

    const [verbGrammars, setVerbGrammars] = useState<VerbGrammar[]>([]);

    const [isLoading, setIsLoading] = useState(verbWords.length > 0);

    const [loadError, setLoadError] = useState<string | null>(null);

    const [selectedSections, setSelectedSections] = useState<GrammarTestSection[]>([
        "present",
        "past",
        "future",
    ]);

    const [questionLimit, setQuestionLimit] = useState<QuestionLimit>("10");

    const [questions, setQuestions] = useState<GrammarQuestion[]>([]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [correctAnswers, setCorrectAnswers] = useState(0);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [timeLeft, setTimeLeft] = useState(TEST_TIMER_SECONDS);

    const [isTimeout, setIsTimeout] = useState(false);

    const [isStarted, setIsStarted] = useState(false);

    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        const currentVerbWords = words.filter((word) => word.category === "verbs");

        if (currentVerbWords.length === 0) {
            return;
        }

        let isActive = true;

        async function loadVerbGrammars() {
            try {
                setIsLoading(true);
                setLoadError(null);

                const grammars = await Promise.all(
                    currentVerbWords.map((word) => getVerbGrammarFromApi(word.id)),
                );

                if (isActive) {
                    setVerbGrammars(grammars);
                }
            } catch (error) {
                if (isActive) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : "Не удалось загрузить грамматику глаголов",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadVerbGrammars();

        return () => {
            isActive = false;
        };
    }, [words]);

    const toggleSection = (section: GrammarTestSection) => {
        setSelectedSections((current) => {
            if (current.includes(section)) {
                return current.filter((item) => item !== section);
            }

            return [...current, section];
        });
    };

    const startTest = () => {
        if (selectedSections.length === 0) {
            return;
        }

        const allQuestions = createQuestions(verbGrammars, selectedSections);

        const limit = questionLimit === "all" ? allQuestions.length : Number(questionLimit);

        const nextQuestions = allQuestions.slice(0, limit);

        setQuestions(nextQuestions);

        setCurrentIndex(0);

        setCorrectAnswers(0);

        setSelectedAnswer(null);

        setTimeLeft(TEST_TIMER_SECONDS);

        setIsTimeout(false);

        setIsFinished(false);

        setIsStarted(true);
    };

    useEffect(() => {
        if (!isStarted || isFinished || !currentQuestion || selectedAnswer !== null || isTimeout) {
            return;
        }

        const timerId = window.setInterval(() => {
            setTimeLeft((previous) => {
                if (previous <= 1) {
                    window.clearInterval(timerId);

                    setIsTimeout(true);

                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timerId);
        };
    }, [isStarted, isFinished, currentQuestion, selectedAnswer, isTimeout]);

    const checkAnswer = (answer: string) => {
        if (!currentQuestion || selectedAnswer !== null || isTimeout) {
            return;
        }

        setSelectedAnswer(answer);

        if (answer === currentQuestion.correctAnswer) {
            setCorrectAnswers((current) => current + 1);
        }
    };

    const finishTest = () => {
        if (isAuthenticated) {
            void addGrammarStatistic({
                correct: correctAnswers,
                total: questions.length,
                sections: selectedSections,
            });
        }

        setIsFinished(true);
    };

    const handleContinue = () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= questions.length) {
            finishTest();

            return;
        }

        setCurrentIndex(nextIndex);

        setSelectedAnswer(null);

        setIsTimeout(false);

        setTimeLeft(TEST_TIMER_SECONDS);
    };

    if (verbWords.length === 0) {
        return (
            <main className="grammar-test-page">
                <h2 className="grammar-page-title">Тест по глаголам</h2>

                <div className="grammar-empty">
                    <h3>Нет выбранных глаголов</h3>

                    <p>Добавьте хотя бы один глагол в раздел «Грамматика».</p>

                    <button
                        type="button"
                        className="styled-btn"
                        onClick={() => navigate("/grammar")}
                    >
                        Вернуться к грамматике
                    </button>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="grammar-test-page">
                <h2 className="grammar-page-title">Тест по глаголам</h2>

                <div className="grammar-empty">
                    <h3>Загрузка грамматики...</h3>
                </div>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="grammar-test-page">
                <h2 className="grammar-page-title">Тест по глаголам</h2>

                <div className="grammar-empty">
                    <h3>Ошибка загрузки</h3>

                    <p>{loadError}</p>

                    <button
                        type="button"
                        className="styled-btn"
                        onClick={() => navigate("/grammar")}
                    >
                        Вернуться к грамматике
                    </button>
                </div>
            </main>
        );
    }

    if (!isStarted) {
        return (
            <main className="grammar-test-page">
                <h2 className="grammar-page-title">Тест по глаголам</h2>

                <div className="grammar-test-setup">
                    <p className="grammar-test-selected">
                        Выбрано глаголов: <strong>{verbGrammars.length}</strong>
                    </p>

                    <h3>Что тестировать</h3>

                    <div className="grammar-test-sections">
                        {GRAMMAR_TEST_SECTIONS.map((section) => (
                            <label key={section} className="grammar-test-option">
                                <input
                                    type="checkbox"
                                    checked={selectedSections.includes(section)}
                                    onChange={() => toggleSection(section)}
                                />

                                <span>{SECTION_TITLES[section]}</span>
                            </label>
                        ))}
                    </div>

                    <h3>Количество вопросов</h3>

                    <select
                        className="grammar-test-select"
                        value={questionLimit}
                        onChange={(event) => setQuestionLimit(event.target.value as QuestionLimit)}
                    >
                        <option value="10">10</option>

                        <option value="20">20</option>

                        <option value="all">Все доступные</option>
                    </select>

                    <div className="grammar-test-setup-actions">
                        <button
                            type="button"
                            className="styled-btn"
                            disabled={selectedSections.length === 0}
                            onClick={startTest}
                        >
                            Начать тест
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={() => navigate("/grammar")}
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (isFinished) {
        const percent =
            questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

        const passed = percent >= PASS_PERCENT;

        return (
            <main className="grammar-test-page">
                <div className="test-result-card">
                    <h3 className="test-result-title">Грамматический тест завершён</h3>

                    <div
                        className={
                            passed ? "test-result-percent passed" : "test-result-percent failed"
                        }
                    >
                        {percent}%
                    </div>

                    <p className="test-result-text">
                        Правильных ответов: <strong>{correctAnswers}</strong> из{" "}
                        <strong>{questions.length}</strong>
                    </p>

                    {!isAuthenticated && (
                        <div className="test-registration-message">
                            <p>
                                Чтобы сохранять статистику грамматических тестов, войдите в аккаунт
                                или зарегистрируйтесь.
                            </p>

                            <div className="test-registration-actions">
                                <Link to="/register" className="styled-btn">
                                    Зарегистрироваться
                                </Link>

                                <Link to="/login" className="test-login-link">
                                    Войти
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="test-result-actions">
                        <button type="button" className="styled-btn" onClick={startTest}>
                            Пройти ещё раз
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={() => {
                                setIsStarted(false);

                                setIsFinished(false);
                            }}
                        >
                            Изменить настройки
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={() => navigate("/grammar")}
                        >
                            К грамматике
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!currentQuestion) {
        return (
            <main className="grammar-test-page">
                <div className="grammar-empty">
                    <h3>Недостаточно форм для тестирования</h3>

                    <button
                        type="button"
                        className="styled-btn"
                        onClick={() => setIsStarted(false)}
                    >
                        Изменить настройки
                    </button>
                </div>
            </main>
        );
    }

    const answered = selectedAnswer !== null || isTimeout;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const progress = ((currentIndex + 1) / questions.length) * 100;

    const getAnswerClass = (answer: string): string => {
        if (!answered) {
            return "styled-btn answer-btn grammar-answer-btn";
        }

        if (answer === currentQuestion.correctAnswer) {
            return "styled-btn answer-btn grammar-answer-btn correct-answer";
        }

        if (answer === selectedAnswer) {
            return "styled-btn answer-btn grammar-answer-btn wrong-answer";
        }

        return "styled-btn answer-btn grammar-answer-btn";
    };

    return (
        <main className="grammar-test-page">
            <div className="test-area">
                <p className="question-number">
                    Вопрос {currentIndex + 1} из {questions.length}
                </p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div
                    className={timeLeft <= TIMER_WARNING_SECONDS ? "timer timer-warning" : "timer"}
                >
                    ⌛ {timeLeft}
                </div>

                <div className="grammar-test-question">
                    <h3 className="grammar-test-infinitive" dir="rtl">
                        {currentQuestion.infinitive}
                    </h3>

                    <p className="grammar-test-translation">{currentQuestion.translation}</p>

                    <div className="grammar-test-task">
                        <span>{currentQuestion.sectionTitle}</span>

                        <strong dir="rtl">{currentQuestion.person}</strong>
                    </div>
                </div>

                <div className="answers-container">
                    {currentQuestion.answers.map((answer) => (
                        <button
                            key={answer}
                            type="button"
                            className={getAnswerClass(answer)}
                            disabled={answered}
                            onClick={() => checkAnswer(answer)}
                            dir="rtl"
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

                        <p className="correct-answer-text">
                            Правильная форма:{" "}
                            <strong dir="rtl">{currentQuestion.correctAnswer}</strong>
                        </p>

                        <button
                            type="button"
                            className="styled-btn continue-btn"
                            onClick={handleContinue}
                        >
                            {currentIndex + 1 === questions.length ? "Завершить" : "Продолжить"}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default GrammarTest;
