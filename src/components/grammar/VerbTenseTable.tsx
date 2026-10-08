import { getSectionForms, PERSON_FORMS } from "../../config/verbForms";
import type { VerbGrammar } from "../../types/grammar";

type VerbTenseTableProps = {
    grammar: VerbGrammar;
};

function VerbTenseTable({ grammar }: VerbTenseTableProps) {
    const rows = [
        { tense: "Прошедшее", forms: getSectionForms(grammar, "past") },
        { tense: "Будущее", forms: getSectionForms(grammar, "future") },
    ];

    return (
        <section className="grammar-detail-section">
            <h4>Прошедшее и будущее время</h4>

            <div className="grammar-tense-table-wrapper">
                <table className="grammar-tense-table">
                    <thead>
                        <tr>
                            <th>Время</th>

                            {PERSON_FORMS.map(({ person }) => (
                                <th key={person} dir="rtl">
                                    {person}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.tense}>
                                <th>{row.tense}</th>

                                {row.forms.map((form, index) => (
                                    <td key={`${row.tense}-${index}`} dir="rtl">
                                        {form.value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default VerbTenseTable;
