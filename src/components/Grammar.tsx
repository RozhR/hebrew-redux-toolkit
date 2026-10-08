import { useState } from "react";
import { Link } from "react-router-dom";

import { useGrammarData } from "../hooks/useGrammarData";
import { useGrammarWords } from "../hooks/useGrammarWords";
import { useGrammarWordsActions } from "../hooks/useGrammarWordsActions";

import type { GrammarWordRef } from "../types/grammar";

import GrammarCard from "./grammar/GrammarCard";
import { AdjectiveDetails, AdverbDetails, VerbDetails } from "./grammar/GrammarDetails";

function getWordKey(word: GrammarWordRef) {
    return `${word.category}-${word.id}`;
}

function Grammar() {
    const { words, isLoading: isWordsLoading, isError: isWordsError } = useGrammarWords();
    const { removeGrammarWord, clearAllGrammarWords, actionError } = useGrammarWordsActions();

    const {
        verbs,
        adjectives,
        adverbs,
        verbGrammars,
        adjectiveGrammars,
        adverbGrammars,
        verbsLoading,
        adjectivesLoading,
        adverbsLoading,
        verbsError,
        adjectivesError,
        adverbsError,
    } = useGrammarData(words);

    const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

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
        if (!window.confirm("Удалить все выбранные слова из грамматики?")) {
            return;
        }

        if (await clearAllGrammarWords()) {
            setExpandedWords(new Set());
        }
    };

    if (isWordsLoading) {
        return (
            <main className="grammar-page">
                <h2 className="grammar-page-title">Грамматика</h2>
                <div className="grammar-empty">
                    <h3>Загрузка выбранных слов...</h3>
                </div>
            </main>
        );
    }

    if (isWordsError) {
        return (
            <main className="grammar-page">
                <h2 className="grammar-page-title">Грамматика</h2>
                <div className="grammar-empty">
                    <h3>Ошибка загрузки</h3>
                    <p>Не удалось загрузить выбранные слова.</p>
                </div>
            </main>
        );
    }

    const count = words.length;

    return (
        <main className="grammar-page">
            <h2 className="grammar-page-title">Грамматика</h2>

            {actionError && <p role="alert">{actionError}</p>}
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
                            onClick={() => void handleClearGrammar()}
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
                    {verbsError && <p>Не удалось загрузить грамматику глаголов.</p>}

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
                                        onRemove={() => void removeGrammarWord(word)}
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
                    {adjectivesError && <p>Не удалось загрузить грамматику прилагательных.</p>}

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
                                        onRemove={() => void removeGrammarWord(word)}
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
                    {adverbsError && <p>Не удалось загрузить грамматику наречий.</p>}

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
                                        onRemove={() => void removeGrammarWord(word)}
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
