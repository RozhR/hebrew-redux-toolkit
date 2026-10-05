import { useEffect, useState } from "react";

import { TEST_TIMER_SECONDS } from "../config/test";

export function useTestTimer(enabled: boolean) {
    const [timeLeft, setTimeLeft] = useState(TEST_TIMER_SECONDS);
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        if (!enabled || isTimeout) {
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

        return () => window.clearInterval(timerId);
    }, [enabled, isTimeout]);

    const resetTimer = () => {
        setTimeLeft(TEST_TIMER_SECONDS);
        setIsTimeout(false);
    };

    return { timeLeft, isTimeout, resetTimer };
}
