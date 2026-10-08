import { describe, expect, test, vi } from "vitest";
import { fetchGrammarBatches } from "./grammarApi";

describe("grammar batch loading", () => {
    test("loads 101 unique words in batches and combines results", async () => {
        const ids = Array.from({ length: 101 }, (_, index) => index + 1);
        const fetch = vi.fn(async (url: string) => ({
            data: { data: url.split("ids=")[1].split(",").map(Number) },
        }));
        const result = await fetchGrammarBatches<number>([...ids, 1], "verbs", fetch);
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch.mock.calls[0][0].split("ids=")[1].split(",")).toHaveLength(100);
        expect(fetch.mock.calls[1][0]).toBe("/grammar/verbs?ids=101");
        expect(result.data).toEqual(ids);
    });

    test("returns an error instead of incomplete grammar when a later batch fails", async () => {
        const error = { status: 503, data: { message: "Unavailable" } };
        const fetch = vi
            .fn()
            .mockResolvedValueOnce({ data: { data: [1] } })
            .mockResolvedValueOnce({ error });
        const result = await fetchGrammarBatches<number>(
            Array.from({ length: 201 }, (_, index) => index + 1),
            "verbs",
            fetch,
        );
        expect(result).toEqual({ error });
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
