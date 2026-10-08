import { shuffleArray } from "../../utils/shuffleArray";
import { getSectionForms, GRAMMAR_TEST_SECTIONS, SECTION_TITLES } from "../../config/verbForms";
import type { GrammarTestSection, VerbGrammar } from "../../types/grammar";

export interface GrammarQuestion {
    id: string;
    infinitive: string;
    translation: string;
    section: GrammarTestSection;
    sectionTitle: string;
    person: string;
    correctAnswer: string;
    answers: string[];
}

export { SECTION_TITLES, GRAMMAR_TEST_SECTIONS } from "../../config/verbForms";

function isValidForm(value: string): boolean {
    const trimmed = value.trim();

    return trimmed !== "" && trimmed !== "—";
}

function getAllForms(grammar: VerbGrammar): string[] {
    return GRAMMAR_TEST_SECTIONS.flatMap((section) => getSectionForms(grammar, section))
        .map((item) => item.value)
        .filter(isValidForm);
}

export function createQuestions(
    grammars: VerbGrammar[],
    sections: GrammarTestSection[],
): GrammarQuestion[] {
    const questions: GrammarQuestion[] = [];

    grammars.forEach((grammar) => {
        const allCurrentVerbForms = Array.from(new Set(getAllForms(grammar)));

        sections.forEach((section) => {
            const forms = getSectionForms(grammar, section);

            const sameSectionForms = Array.from(
                new Set(forms.map((item) => item.value).filter(isValidForm)),
            );

            forms.forEach((form, index) => {
                if (!isValidForm(form.value)) {
                    return;
                }

                const wrongCandidates = Array.from(
                    new Set([...sameSectionForms, ...allCurrentVerbForms]),
                ).filter((value) => value !== form.value);

                if (wrongCandidates.length < 3) {
                    return;
                }

                const wrongAnswers = shuffleArray(wrongCandidates).slice(0, 3);

                const answers = shuffleArray([form.value, ...wrongAnswers]);

                questions.push({
                    id: `${grammar.base.id}-${section}-${index}`,
                    infinitive: grammar.base.infinitive,
                    translation: grammar.base.translation,
                    section,
                    sectionTitle: SECTION_TITLES[section],
                    person: form.person,
                    correctAnswer: form.value,
                    answers,
                });
            });
        });
    });

    return shuffleArray(questions);
}
