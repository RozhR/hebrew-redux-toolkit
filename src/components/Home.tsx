import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CATEGORY_CONFIG } from "../config/categories";
import { useGrammarWords } from "../hooks/useGrammarWords";
import { useUserProgress } from "../hooks/useUserProgress";

type HomeIconName = "book" | "grammar" | "test" | "statistics" | "audio";

type HomeIconProps = {
    name: HomeIconName;
};

const FEATURES = [
    {
        title: "Карточки слов",
        description: "Изучайте слова по уровням — от простых к более сложным.",
    },
    {
        title: "Грамматика",
        description: "Сохраняйте слова и разбирайте их формы, времена и примеры.",
    },
    {
        title: "Тестирование",
        description:
            "Тренируйте не только знание перевода, но и правильное употребление глаголов в разных временах и формах.",
    },
    {
        title: "Статистика и прогресс",
        description:
            "Наблюдайте за своим прогрессом обучения и сохраняйте мотивацию двигаться дальше.",
    },
] as const;

function HomeIcon({ name }: HomeIconProps) {
    const commonProps = {
        width: 21,
        height: 21,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true as const,
    };

    switch (name) {
        case "book":
            return (
                <svg {...commonProps}>
                    <path d="M12 7.5c-2-2-5-2.6-9-2.2v13c4-.4 7 .2 9 2.2 2-2 5-2.6 9-2.2v-13c-4-.4-7 .2-9 2.2Z" />
                    <path d="M12 7.5v13" />
                </svg>
            );
        case "grammar":
            return (
                <svg {...commonProps}>
                    <rect x="5" y="3" width="14" height="18" rx="2" />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                </svg>
            );
        case "test":
            return (
                <svg {...commonProps}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="m7.5 12 3 3 6-7" />
                </svg>
            );
        case "statistics":
            return (
                <svg {...commonProps}>
                    <rect x="3" y="12" width="4" height="9" rx="1" />
                    <rect x="10" y="7" width="4" height="14" rx="1" />
                    <rect x="17" y="3" width="4" height="18" rx="1" />
                </svg>
            );
        case "audio":
            return (
                <svg {...commonProps}>
                    <path d="M11 5 6.8 9H3v6h3.8l4.2 4V5Z" />
                    <path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
                </svg>
            );
    }
}

function Home() {
    const pageRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    // Respect the actual navbar height (it can vary with browser zoom and screen size).
    useEffect(() => {
        const page = pageRef.current;
        if (!page) return;

        const updateHeight = () => {
            const available = Math.max(
                0,
                window.innerHeight - page.getBoundingClientRect().top - 12,
            );
            page.style.setProperty("--home-available-height", `${available}px`);
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);

        const navbar = document.querySelector(".navbar");
        const observer =
            typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHeight) : null;
        if (navbar) observer?.observe(navbar);

        return () => {
            window.removeEventListener("resize", updateHeight);
            observer?.disconnect();
        };
    }, []);
    const { words, isLoading: isWordsLoading, isError: isWordsError } = useGrammarWords();
    const { progress, isProgressLoading, isProgressError } = useUserProgress();

    const lastUnlockedVerbLevel = Math.min(
        Math.max(1, progress.verbs),
        CATEGORY_CONFIG.verbs.levels,
    );

    const handleGrammarTest = () => {
        if (isWordsLoading || isProgressLoading) return;

        if (isWordsError || isProgressError) {
            window.alert("Не удалось проверить выбранные слова. Попробуйте ещё раз.");
            return;
        }

        const hasSelectedVerbs = words.some((word) => word.category === "verbs");

        if (hasSelectedVerbs) {
            navigate("/grammar/test");
            return;
        }

        window.alert("Выберите слово для тестирования");
        navigate(`/verbs/${lastUnlockedVerbLevel}`);
    };

    return (
        <main className="home-page" ref={pageRef}>
            <aside className="home-sidebar" aria-label="Разделы Hebrew Learning">
                <div className="home-brand">
                    <span className="home-brand-logo">
                        <img src="/favicon.png" alt="" />
                    </span>
                    <span className="home-brand-name">Hebrew Learning</span>
                </div>

                <h2 className="home-sidebar-heading">
                    {isProgressLoading || isProgressError ? (
                        <span className="home-learning-link home-learning-link-unavailable">
                            <HomeIcon name="book" />
                            <span>Изучение слов</span>
                        </span>
                    ) : (
                        <Link to={`/verbs/${lastUnlockedVerbLevel}`} className="home-learning-link">
                            <HomeIcon name="book" />
                            <span>Изучение слов</span>
                        </Link>
                    )}
                </h2>

                <ul className="home-word-counts" aria-label="Словарный запас сайта">
                    <li>
                        <strong>500</strong>
                        <span>глаголов</span>
                    </li>
                    <li>
                        <strong>500</strong>
                        <span>прилагательных</span>
                    </li>
                    <li>
                        <strong>300</strong>
                        <span>наречий</span>
                    </li>
                </ul>

                <nav className="home-sidebar-nav" aria-label="Разделы обучения">
                    <Link to="/grammar" className="home-sidebar-link">
                        <HomeIcon name="grammar" />
                        <span>Грамматика</span>
                    </Link>
                    <button
                        type="button"
                        className="home-sidebar-link home-sidebar-button"
                        onClick={handleGrammarTest}
                        disabled={isWordsLoading || isProgressLoading}
                    >
                        <HomeIcon name="test" />
                        <span>Тесты</span>
                    </button>
                    <Link to="/statistics" className="home-sidebar-link">
                        <HomeIcon name="statistics" />
                        <span>Статистика</span>
                    </Link>
                </nav>
            </aside>

            <div className="home-main">
                <section className="home-hero" aria-labelledby="home-title">
                    <div className="home-hero-content">
                        <h1
                            className="home-hero-title"
                            id="home-title"
                            aria-label="Изучение иврита с карточками и тестами"
                        >
                            Изучение <span>иврита</span>
                            <br />с карточками
                            <br />и тестами
                        </h1>
                        <p className="home-hero-description">
                            Расширяйте свой словарный запас. Запоминайте слова с интерактивными
                            карточками, проверяйте знания в тестах и отслеживайте свой прогресс.
                        </p>
                        <Link to="/verbs/1" className="styled-btn home-start-button">
                            Начать обучение <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="home-hero-illustration" aria-hidden="true">
                        <span className="home-art-glyph home-art-glyph-one">א</span>
                        <span className="home-art-glyph home-art-glyph-two">ב</span>
                        <span className="home-art-glyph home-art-glyph-three">ש</span>
                        <span className="home-art-spark home-art-spark-one" />
                        <span className="home-art-spark home-art-spark-two" />
                        <span className="home-art-spark home-art-spark-three" />
                        <div className="home-art-card home-art-card-back" />
                        <div className="home-art-card home-art-card-front">
                            <span className="home-art-audio">
                                <HomeIcon name="audio" />
                            </span>
                            <span className="home-art-chosen">✓</span>
                            <span className="home-art-word" dir="rtl" lang="he">
                                ללמוד
                            </span>
                        </div>
                    </div>
                </section>

                <section className="home-capabilities" aria-labelledby="home-capabilities-title">
                    <h2 id="home-capabilities-title" className="home-section-heading">
                        Возможности Hebrew Learning
                    </h2>
                    <div className="home-capabilities-grid">
                        {FEATURES.map((feature) => (
                            <article className="home-capability" key={feature.title}>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Home;
