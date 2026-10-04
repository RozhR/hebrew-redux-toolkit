import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getAdjectiveGrammarFromApi } from "../api/adjectiveGrammar";

import { getAdverbGrammarFromApi } from "../api/adverbGrammar";

import { getVerbGrammarFromApi } from "../api/verbGrammar";

import { useGrammarWordsActions } from "../hooks/useGrammarWordsActions";

import { useAppSelector } from "../store/hooks";

import type {
    AdjectiveGrammar,
    AdverbGrammar,
    GrammarWordRef,
    VerbGrammar,
} from "../types/grammar";

import GrammarCard from "./grammar/GrammarCard";

import { AdjectiveDetails, AdverbDetails, VerbDetails } from "./grammar/GrammarDetails";

function getWordKey(word: GrammarWordRef): string {
    return `${word.category}-${word.id}`;
}

function Grammar() {
    const words = useAppSelector((state) => state.grammar.words);

    const { removeGrammarWord, clearAllGrammarWords } = useGrammarWordsActions();

    const count = words.length;

    const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

    const [verbGrammars, setVerbGrammars] = useState<Record<number, VerbGrammar>>({});

    const [adjectiveGrammars, setAdjectiveGrammars] = useState<Record<number, AdjectiveGrammar>>(
        {},
    );

    const [adverbGrammars, setAdverbGrammars] = useState<Record<number, AdverbGrammar>>({});

    const [verbsLoading, setVerbsLoading] = useState(false);

    const [adjectivesLoading, setAdjectivesLoading] = useState(false);

    const [adverbsLoading, setAdverbsLoading] = useState(false);

    const [verbsError, setVerbsError] = useState<string | null>(null);

    const [adjectivesError, setAdjectivesError] = useState<string | null>(null);

    const [adverbsError, setAdverbsError] = useState<string | null>(null);

    const verbs = words.filter((word) => word.category === "verbs");

    const adjectives = words.filter((word) => word.category === "adjectives");

    const adverbs = words.filter((word) => word.category === "adverbs");

    useEffect(() => {
        const verbWords = words.filter((word) => word.category === "verbs");

        if (verbWords.length === 0) {
            return;
        }

        let isActive = true;

        async function loadVerbGrammars() {
            try {
                setVerbsLoading(true);

                setVerbsError(null);

                const entries = await Promise.all(
                    verbWords.map(async (word) => {
                        const grammar = await getVerbGrammarFromApi(word.id);

                        return [word.id, grammar] as const;
                    }),
                );

                if (isActive) {
                    setVerbGrammars(Object.fromEntries(entries));
                }
            } catch (error) {
                if (isActive) {
                    setVerbsError(
                        error instanceof Error
                            ? error.message
                            : "Не удалось загрузить грамматику глаголов",
                    );
                }
            } finally {
                if (isActive) {
                    setVerbsLoading(false);
                }
            }
        }

        void loadVerbGrammars();

        return () => {
            isActive = false;
        };
    }, [words]);

    useEffect(() => {
        const adjectiveWords = words.filter((word) => word.category === "adjectives");

        if (adjectiveWords.length === 0) {
            return;
        }

        let isActive = true;

        async function loadAdjectiveGrammars() {
            try {
                setAdjectivesLoading(true);

                setAdjectivesError(null);

                const entries = await Promise.all(
                    adjectiveWords.map(async (word) => {
                        const grammar = await getAdjectiveGrammarFromApi(word.id);

                        return [word.id, grammar] as const;
                    }),
                );

                if (isActive) {
                    setAdjectiveGrammars(Object.fromEntries(entries));
                }
            } catch (error) {
                if (isActive) {
                    setAdjectivesError(
                        error instanceof Error
                            ? error.message
                            : "Не удалось загрузить грамматику прилагательных",
                    );
                }
            } finally {
                if (isActive) {
                    setAdjectivesLoading(false);
                }
            }
        }

        void loadAdjectiveGrammars();

        return () => {
            isActive = false;
        };
    }, [words]);

    useEffect(() => {
        const adverbWords = words.filter((word) => word.category === "adverbs");

        if (adverbWords.length === 0) {
            return;
        }

        let isActive = true;

        async function loadAdverbGrammars() {
            try {
                setAdverbsLoading(true);

                setAdverbsError(null);

                const entries = await Promise.all(
                    adverbWords.map(async (word) => {
                        const grammar = await getAdverbGrammarFromApi(word.id);

                        return [word.id, grammar] as const;
                    }),
                );

                if (isActive) {
                    setAdverbGrammars(Object.fromEntries(entries));
                }
            } catch (error) {
                if (isActive) {
                    setAdverbsError(
                        error instanceof Error
                            ? error.message
                            : "Не удалось загрузить грамматику наречий",
                    );
                }
            } finally {
                if (isActive) {
                    setAdverbsLoading(false);
                }
            }
        }

        void loadAdverbGrammars();

        return () => {
            isActive = false;
        };
    }, [words]);

    const toggleWord = (word: GrammarWordRef) => {
        const key = getWordKey(word);

        setExpandedWords((current) => {
            const next = new Set(current);

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }

            return next;
        });
    };

    const handleClearGrammar = async () => {
        const confirmed = window.confirm("Удалить все выбранные слова из грамматики?");

        if (!confirmed) {
            return;
        }

        await clearAllGrammarWords();

        setExpandedWords(new Set());
    };

    return (
        <main className="grammar-page">
            <h2 className="grammar-page-title">Грамматика</h2>

            <div className="grammar-page-toolbar">
                <p>
                    Выбрано слов: <strong>{count}</strong>
                </p>

                <div className="grammar-page-toolbar-actions">
                    {verbs.length > 0 && (
                        <Link to="/grammar/test" className="grammar-test-btn">
                            Тест по глаголам
                        </Link>
                    )}

                    {count > 0 && (
                        <button
                            type="button"
                            className="grammar-clear-btn"
                            onClick={() => {
                                void handleClearGrammar();
                            }}
                        >
                            Очистить всё
                        </button>
                    )}
                </div>
            </div>

            {count === 0 && (
                <div className="grammar-empty">
                    <h3>Пока ничего не выбрано</h3>

                    <p>Добавьте слова с карточек, чтобы увидеть здесь их грамматический разбор.</p>
                </div>
            )}

            {verbs.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">Глаголы</h3>

                    {verbsLoading && <p>Загрузка грамматики...</p>}

                    {verbsError && <p>Ошибка загрузки: {verbsError}</p>}

                    {!verbsLoading && !verbsError && (
                        <div className="grammar-words-list">
                            {verbs.map((word) => {
                                const grammar = verbGrammars[word.id];

                                if (!grammar) {
                                    return null;
                                }

                                const key = getWordKey(word);

                                return (
                                    <GrammarCard
                                        key={key}
                                        title={grammar.base.infinitive}
                                        translation={grammar.base.translation}
                                        level={grammar.base.level}
                                        expanded={expandedWords.has(key)}
                                        onToggle={() => toggleWord(word)}
                                        onRemove={() => {
                                            void removeGrammarWord(word);
                                        }}
                                    >
                                        <VerbDetails grammar={grammar} />
                                    </GrammarCard>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {adjectives.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">Прилагательные</h3>

                    {adjectivesLoading && <p>Загрузка грамматики...</p>}

                    {adjectivesError && <p>Ошибка загрузки: {adjectivesError}</p>}

                    {!adjectivesLoading && !adjectivesError && (
                        <div className="grammar-words-list">
                            {adjectives.map((word) => {
                                const grammar = adjectiveGrammars[word.id];

                                if (!grammar) {
                                    return null;
                                }

                                const key = getWordKey(word);

                                return (
                                    <GrammarCard
                                        key={key}
                                        title={grammar.base.masculine_singular}
                                        translation={grammar.base.translation}
                                        level={grammar.base.level}
                                        expanded={expandedWords.has(key)}
                                        onToggle={() => toggleWord(word)}
                                        onRemove={() => {
                                            void removeGrammarWord(word);
                                        }}
                                    >
                                        <AdjectiveDetails grammar={grammar} />
                                    </GrammarCard>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {adverbs.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">Наречия</h3>

                    {adverbsLoading && <p>Загрузка грамматики...</p>}

                    {adverbsError && <p>Ошибка загрузки: {adverbsError}</p>}

                    {!adverbsLoading && !adverbsError && (
                        <div className="grammar-words-list">
                            {adverbs.map((word) => {
                                const grammar = adverbGrammars[word.id];

                                if (!grammar) {
                                    return null;
                                }

                                const key = getWordKey(word);

                                return (
                                    <GrammarCard
                                        key={key}
                                        title={grammar.base.adverb}
                                        translation={grammar.base.translation}
                                        level={grammar.base.level}
                                        expanded={expandedWords.has(key)}
                                        onToggle={() => toggleWord(word)}
                                        onRemove={() => {
                                            void removeGrammarWord(word);
                                        }}
                                    >
                                        <AdverbDetails grammar={grammar} />
                                    </GrammarCard>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}

export default Grammar;
