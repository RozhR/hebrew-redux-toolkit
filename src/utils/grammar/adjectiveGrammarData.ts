import adjectivesBase from "../../data/grammar/adjectives/base.json";
import adjectivesConstructions from "../../data/grammar/adjectives/constructions.json";
import adjectivesExamples from "../../data/grammar/adjectives/examples.json";

import type { AdjectiveGrammar } from "../../types/grammar";

function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}

export function getAdjectiveGrammar(id: number): AdjectiveGrammar | undefined {
    const base = findById(adjectivesBase, id);

    const construction = findById(adjectivesConstructions, id);

    const examples = findById(adjectivesExamples, id);

    if (!base || !examples) {
        return undefined;
    }

    return {
        base,
        construction,
        examples,
    };
}
