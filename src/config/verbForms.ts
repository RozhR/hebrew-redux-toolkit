import type { GrammarTestSection, VerbGrammar } from "../types/grammar";

export const SECTION_TITLES: Record<GrammarTestSection, string> = {
    present: "Настоящее время",
    past: "Прошедшее время",
    future: "Будущее время",
    imperative: "Повелительное наклонение",
};

export const GRAMMAR_TEST_SECTIONS: GrammarTestSection[] = [
    "present",
    "past",
    "future",
    "imperative",
];

export const PRESENT_FORMS = [
    { person: "הוא", key: "masculine_singular" },
    { person: "היא", key: "feminine_singular" },
    { person: "הם", key: "masculine_plural" },
    { person: "הן", key: "feminine_plural" },
] as const;

export const PERSON_FORMS = [
    { person: "אני", key: "first_person_singular" },
    { person: "אתה", key: "second_person_masculine_singular" },
    { person: "את", key: "second_person_feminine_singular" },
    { person: "הוא", key: "third_person_masculine_singular" },
    { person: "היא", key: "third_person_feminine_singular" },
    { person: "אנחנו", key: "first_person_plural" },
    { person: "אתם", key: "second_person_masculine_plural" },
    { person: "אתן", key: "second_person_feminine_plural" },
    { person: "הם / הן", key: "third_person_plural" },
] as const;

export const IMPERATIVE_FORMS = [
    { person: "אתה", key: "imperative_masculine" },
    { person: "את", key: "imperative_feminine" },
    { person: "אתם / אתן", key: "imperative_plural" },
] as const;

export function getSectionForms(
    grammar: VerbGrammar,
    section: GrammarTestSection,
): { person: string; value: string }[] {
    switch (section) {
        case "present":
            return PRESENT_FORMS.map(({ person, key }) => ({
                person,
                value: grammar.present[key],
            }));
        case "past":
        case "future":
            return PERSON_FORMS.map(({ person, key }) => ({
                person,
                value: grammar[section][key],
            }));
        case "imperative":
            return IMPERATIVE_FORMS.map(({ person, key }) => ({
                person,
                value: grammar.future[key],
            }));
    }
}
