import adverbsBase from "../../data/grammar/adverbs/base.json";
import adverbsExamples from "../../data/grammar/adverbs/examples.json";
import adverbsRelations from "../../data/grammar/adverbs/relations.json";
import adverbsUsage from "../../data/grammar/adverbs/usage.json";

import type { AdverbGrammar } from "../../types/grammar";

function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}

export function getAdverbGrammar(id: number): AdverbGrammar | undefined {
    const base = findById(adverbsBase, id);

    const usage = findById(adverbsUsage, id);

    const relation = findById(adverbsRelations, id);

    const examples = findById(adverbsExamples, id);

    if (!base || !usage || !examples) {
        return undefined;
    }

    return {
        base,
        usage,
        relation,
        examples,
    };
}
