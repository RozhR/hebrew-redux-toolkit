import {
    type DragEvent,
    type MouseEvent,
    type TouchEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import { addWord, removeWord } from "../store/grammarReducer";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import type { CardWithId, Category } from "../types";

type CardProps = {
    card: CardWithId;
    category: Category;
};

const LONG_PRESS_DELAY = 700;
const MOVE_TOLERANCE = 15;

function Card({ card, category }: CardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const [isPressing, setIsPressing] = useState(false);

    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const dispatch = useAppDispatch();

    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const longPressTriggered = useRef(false);

    const startPosition = useRef({
        x: 0,
        y: 0,
    });

    const pressedInGrammar = useRef(false);

    const grammarWord = {
        category,
        id: card.id,
    };

    const inGrammar = useAppSelector((state) =>
        state.grammar.words.some((item) => item.category === category && item.id === card.id),
    );

    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice(
                navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches,
            );
        };

        checkTouchDevice();

        window.addEventListener("resize", checkTouchDevice);

        return () => {
            window.removeEventListener("resize", checkTouchDevice);
        };
    }, []);

    const clearLongPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);

            longPressTimer.current = null;
        }

        setIsPressing(false);
    };

    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    const handleClick = () => {
        if (longPressTriggered.current) {
            longPressTriggered.current = false;

            return;
        }

        setIsFlipped((current) => !current);
    };

    const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
        if (isTouchDevice) {
            event.preventDefault();

            return;
        }

        event.dataTransfer.effectAllowed = "copy";

        event.dataTransfer.setData("application/json", JSON.stringify(grammarWord));
    };

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        if (event.touches.length !== 1) {
            return;
        }

        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        longPressTriggered.current = false;

        pressedInGrammar.current = inGrammar;

        startPosition.current = {
            x: touch.clientX,
            y: touch.clientY,
        };

        setIsPressing(true);

        longPressTimer.current = window.setTimeout(() => {
            longPressTriggered.current = true;

            setIsPressing(false);

            if (pressedInGrammar.current) {
                dispatch(removeWord(grammarWord));
            } else {
                dispatch(addWord(grammarWord));
            }

            if ("vibrate" in navigator) {
                navigator.vibrate(30);
            }

            longPressTimer.current = null;
        }, LONG_PRESS_DELAY);
    };

    const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
        if (!longPressTimer.current) {
            return;
        }

        const touch = event.touches[0];

        if (!touch) {
            clearLongPress();

            return;
        }

        const deltaX = Math.abs(touch.clientX - startPosition.current.x);

        const deltaY = Math.abs(touch.clientY - startPosition.current.y);

        if (deltaX > MOVE_TOLERANCE || deltaY > MOVE_TOLERANCE) {
            clearLongPress();
        }
    };

    const handleTouchEnd = () => {
        clearLongPress();
    };

    const handleTouchCancel = () => {
        clearLongPress();
    };

    const handleRemoveFromGrammar = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        dispatch(removeWord(grammarWord));
    };

    const handleIndicatorTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    return (
        <div
            className={`
                card
                ${isFlipped ? "flipped" : ""}
                ${isPressing ? "long-press-active" : ""}
                ${inGrammar ? "in-grammar" : ""}
            `}
            onClick={handleClick}
            draggable={!isTouchDevice}
            onDragStart={handleDragStart}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onContextMenu={(event) => event.preventDefault()}
            data-category={category}
            data-id={card.id}
        >
            {inGrammar && (
                <button
                    type="button"
                    className="grammar-card-indicator"
                    title="Удалить из грамматики"
                    aria-label="Удалить из грамматики"
                    draggable={false}
                    onTouchStart={handleIndicatorTouchStart}
                    onClick={handleRemoveFromGrammar}
                >
                    <span className="grammar-indicator-check">✓</span>

                    <span className="grammar-indicator-remove">×</span>
                </button>
            )}

            <div className="card-inner">
                <div className="card-front">{card.hebrew}</div>

                <div className="card-back">{card.russian}</div>
            </div>
        </div>
    );
}

export default Card;
