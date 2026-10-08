import { shuffleArray } from "../utils/shuffleArray";
import { useState } from "react";

import Card from "./Card";
import GrammarDropZone from "./GrammarDropZone";

import type { CardWithId, Category } from "../types";

type CardListProps = {
    cards: CardWithId[];
    category: Category;
    onStartTest: () => void;
};

function CardList({ cards, category, onStartTest }: CardListProps) {
    const [shuffledCards, setShuffledCards] = useState<CardWithId[]>(cards);

    const shuffleCards = () => {
        setShuffledCards((current) => shuffleArray(current));
    };

    return (
        <>
            <GrammarDropZone />

            <div className="functions">
                <button type="button" className="styled-btn" onClick={shuffleCards}>
                    Перемешать
                </button>

                <button type="button" className="styled-btn" onClick={onStartTest}>
                    Тестирование
                </button>
            </div>

            <div className="card-container">
                {shuffledCards.map((card) => (
                    <Card key={`${category}-${card.id}`} card={card} category={category} />
                ))}
            </div>
        </>
    );
}

export default CardList;
