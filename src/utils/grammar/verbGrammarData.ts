import verbsBase from "../../data/grammar/verbs/base.json";
import verbsExamples from "../../data/grammar/verbs/examples.json";
import verbsFutureImperative from "../../data/grammar/verbs/futureImperative.json";
import verbsPast from "../../data/grammar/verbs/past.json";
import verbsPresent from "../../data/grammar/verbs/present.json";

import type { VerbGrammar } from "../../types/grammar";

function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}

export function getVerbGrammar(id: number): VerbGrammar | undefined {
    const base = findById(verbsBase, id);
    const present = findById(verbsPresent, id);
    const past = findById(verbsPast, id);
    const future = findById(verbsFutureImperative, id);
    const examples = findById(verbsExamples, id);

    if (!base || !present || !past || !future || !examples) {
        return undefined;
    }

    return {
        base,
        present,
        past,
        future,
        examples,
    };
}
