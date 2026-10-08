import { StrictMode, type ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useTestTimer } from "./useTestTimer";

function wrapper({ children }: { children: ReactNode }) {
    return <StrictMode>{children}</StrictMode>;
}

describe("test timer", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    test("expires after 15 seconds and stays at zero", () => {
        const { result } = renderHook(() => useTestTimer(true), { wrapper });
        act(() => vi.advanceTimersByTime(14000));
        expect(result.current.timeLeft).toBe(1);
        expect(result.current.isTimeout).toBe(false);
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.timeLeft).toBe(0);
        expect(result.current.isTimeout).toBe(true);
        act(() => vi.advanceTimersByTime(5000));
        expect(result.current.timeLeft).toBe(0);
    });

    test("starts a new countdown after resetting an expired question", () => {
        const { result } = renderHook(() => useTestTimer(true), { wrapper });
        act(() => vi.advanceTimersByTime(15000));
        act(() => result.current.resetTimer());
        expect(result.current.timeLeft).toBe(15);
        expect(result.current.isTimeout).toBe(false);
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.timeLeft).toBe(14);
    });

    test("stops after an answer and resets for the next question", () => {
        const { result, rerender } = renderHook(({ enabled }) => useTestTimer(enabled), {
            initialProps: { enabled: true },
            wrapper,
        });
        act(() => vi.advanceTimersByTime(5000));
        rerender({ enabled: false });
        act(() => vi.advanceTimersByTime(20000));
        expect(result.current.timeLeft).toBe(10);
        expect(result.current.isTimeout).toBe(false);
        act(() => result.current.resetTimer());
        rerender({ enabled: true });
        act(() => vi.advanceTimersByTime(1000));
        expect(result.current.timeLeft).toBe(14);
    });

    test("clears the timer when leaving the test", () => {
        const { unmount } = renderHook(() => useTestTimer(true), { wrapper });
        expect(vi.getTimerCount()).toBe(1);
        unmount();
        expect(vi.getTimerCount()).toBe(0);
    });
});
