import { useMemo } from "react";

import {
    useGetAdjectiveGrammarsQuery,
    useGetAdverbGrammarsQuery,
    useGetVerbGrammarsQuery,
} from "../api/grammarApi";

import type {
    AdjectiveGrammar,
    AdverbGrammar,
    GrammarWordRef,
    VerbGrammar,
} from "../types/grammar";

function toRecord<T extends { base: { id: number } }>(items: T[] | undefined) {
    return Object.fromEntries((items ?? []).map((item) => [item.base.id, item])) as Record<
        number,
        T
    >;
}

export function useGrammarData(words: GrammarWordRef[]) {
    const groups = useMemo(
        () => ({
            verbs: words.filter((word) => word.category === "verbs"),
            adjectives: words.filter((word) => word.category === "adjectives"),
            adverbs: words.filter((word) => word.category === "adverbs"),
        }),
        [words],
    );

    const verbIds = useMemo(() => groups.verbs.map((word) => word.id), [groups.verbs]);
    const adjectiveIds = useMemo(
        () => groups.adjectives.map((word) => word.id),
        [groups.adjectives],
    );
    const adverbIds = useMemo(() => groups.adverbs.map((word) => word.id), [groups.adverbs]);

    const verbQuery = useGetVerbGrammarsQuery(verbIds, { skip: verbIds.length === 0 });
    const adjectiveQuery = useGetAdjectiveGrammarsQuery(adjectiveIds, {
        skip: adjectiveIds.length === 0,
    });
    const adverbQuery = useGetAdverbGrammarsQuery(adverbIds, { skip: adverbIds.length === 0 });

    return {
        ...groups,
        verbGrammars: toRecord<VerbGrammar>(verbQuery.data),
        adjectiveGrammars: toRecord<AdjectiveGrammar>(adjectiveQuery.data),
        adverbGrammars: toRecord<AdverbGrammar>(adverbQuery.data),
        verbsLoading: verbQuery.isLoading || verbQuery.isFetching,
        adjectivesLoading: adjectiveQuery.isLoading || adjectiveQuery.isFetching,
        adverbsLoading: adverbQuery.isLoading || adverbQuery.isFetching,
        verbsError: verbQuery.isError,
        adjectivesError: adjectiveQuery.isError,
        adverbsError: adverbQuery.isError,
    };
}
