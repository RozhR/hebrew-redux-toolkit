import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_ORIGIN = "https://hebrewlearning.co.il";
const BRAND = "Hebrew Learning";

type SeoInfo = {
    title: string;
    description: string;
    indexable: boolean;
};

const categorySeo: Record<string, { label: string; description: string }> = {
    verbs: {
        label: "Глаголы иврита",
        description: "Учите глаголы иврита с интерактивными карточками и проверяйте знания в тестах.",
    },
    adjectives: {
        label: "Прилагательные иврита",
        description:
            "Запоминайте прилагательные иврита с карточками, переводами и тестами для самопроверки.",
    },
    adverbs: {
        label: "Наречия иврита",
        description: "Изучайте наречия иврита по уровням, повторяйте слова и проходите тесты.",
    },
};

function getSeoInfo(pathname: string): SeoInfo {
    if (pathname === "/") {
        return {
            title: `Изучение иврита онлайн — карточки и тесты | ${BRAND}`,
            description:
                "Учите иврит онлайн: глаголы, прилагательные, наречия, карточки, тесты, грамматика и отслеживание прогресса.",
            indexable: true,
        };
    }

    const levelMatch = pathname.match(/^\/(verbs|adjectives|adverbs)\/(\d+)(\/test)?$/);

    if (levelMatch) {
        const category = categorySeo[levelMatch[1]];
        const level = Number(levelMatch[2]);

        return {
            title: `${category.label} — уровень ${level} | ${BRAND}`,
            description: category.description,
            // Advanced levels depend on user progress; tests have little standalone search value.
            indexable: level === 1 && !levelMatch[3],
        };
    }

    if (pathname === "/grammar") {
        return {
            title: `Моя грамматика иврита | ${BRAND}`,
            description: "Грамматический разбор выбранных слов и упражнения по ивриту.",
            // This page displays a personal collection and may be empty for search crawlers.
            indexable: false,
        };
    }

    const privatePageTitles: Record<string, string> = {
        "/login": "Вход",
        "/register": "Регистрация",
        "/profile": "Профиль",
        "/statistics": "Моя статистика",
        "/grammar/test": "Тест по грамматике",
    };

    return {
        title: `${privatePageTitles[pathname] ?? "Страница"} | ${BRAND}`,
        description: "Личный раздел приложения для изучения иврита.",
        indexable: false,
    };
}

function updateMeta(name: string, content: string) {
    let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

    if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.appendChild(element);
    }

    element.content = content;
}

function SeoMeta() {
    const { pathname } = useLocation();

    useEffect(() => {
        const seo = getSeoInfo(pathname);

        document.title = seo.title;
        updateMeta("description", seo.description);
        updateMeta("robots", seo.indexable ? "index, follow" : "noindex, follow");

        let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

        if (!seo.indexable) {
            canonical?.remove();
            return;
        }

        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }

        canonical.href = `${SITE_ORIGIN}${pathname}`;
    }, [pathname]);

    return null;
}

export default SeoMeta;
