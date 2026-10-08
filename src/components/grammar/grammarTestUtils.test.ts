import { describe, expect, test } from "vitest";
import { createQuestions } from "./grammarTestUtils";
import type { VerbGrammar } from "../../types/grammar";

const grammar: VerbGrammar = {
    base: {
        id: 1,
        infinitive: "להיות",
        translation: "быть",
        government: "—",
        level: 1,
    },
    present: {
        id: 1,
        infinitive: "להיות",
        binyan: "פעל",
        masculine_singular: "—",
        feminine_singular: "—",
        masculine_plural: "—",
        feminine_plural: "—",
    },
    past: {
        id: 1,
        infinitive: "להיות",
        first_person_singular: "הייתי",
        second_person_masculine_singular: "היית",
        second_person_feminine_singular: "היית",
        third_person_masculine_singular: "היה",
        third_person_feminine_singular: "הייתה",
        first_person_plural: "היינו",
        second_person_masculine_plural: "הייתם",
        second_person_feminine_plural: "הייתן",
        third_person_plural: "היו",
    },
    future: {
        id: 1,
        infinitive: "להיות",
        first_person_singular: "אהיה",
        second_person_masculine_singular: "תהיה",
        second_person_feminine_singular: "תהיי",
        third_person_masculine_singular: "יהיה",
        third_person_feminine_singular: "תהיה",
        first_person_plural: "נהיה",
        second_person_masculine_plural: "תהיו",
        second_person_feminine_plural: "תהיו",
        third_person_plural: "יהיו",
        imperative_masculine: "היה",
        imperative_feminine: "היי",
        imperative_plural: "היו",
    },
    examples: {
        id: 1,
        infinitive: "להיות",
        translation: "быть",
        present_example: "היא בבית עכשיו.",
        present_translation: "Она сейчас дома.",
        past_example: "היינו בירושלים אתמול.",
        past_translation: "Мы вчера были в Иерусалиме.",
        future_example: "הם יהיו בעבודה מחר.",
        future_translation: "Они завтра будут на работе.",
    },
};

describe("grammar question generation", () => {
    test("keeps the correct form for each pronoun in past and future", () => {
        const questions = createQuestions([grammar], ["past", "future"]);
        expect(questions).toHaveLength(18);
        for (const section of ["past", "future"] as const) {
            const byPerson = new Map(
                questions
                    .filter((question) => question.section === section)
                    .map((question) => [question.person, question.correctAnswer]),
            );
            expect(byPerson.get("אני")).toBe(grammar[section].first_person_singular);
            expect(byPerson.get("את")).toBe(grammar[section].second_person_feminine_singular);
            expect(byPerson.get("אתן")).toBe(grammar[section].second_person_feminine_plural);
            expect(byPerson.get("הם / הן")).toBe(grammar[section].third_person_plural);
        }
        for (const question of questions) {
            expect(question.answers).toHaveLength(4);
            expect(new Set(question.answers).size).toBe(4);
            expect(question.answers).toContain(question.correctAnswer);
        }
    });

    test("does not create questions for missing forms", () => {
        const missing = {
            ...grammar,
            present: {
                ...grammar.present,
                masculine_singular: "—",
                feminine_singular: " ",
                masculine_plural: "—",
                feminine_plural: "",
            },
        };
        const questions = createQuestions([missing], ["present"]);
        expect(questions).toHaveLength(0);
    });
});
