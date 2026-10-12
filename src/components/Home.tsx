import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="home-page">
            <h1>Изучайте иврит онлайн с карточками и тестами</h1>

            <p className="home-lead">
                Учите глаголы, прилагательные и наречия по уровням. Запоминайте слова с
                интерактивными карточками, проверяйте знания в тестах и отслеживайте свой прогресс.
            </p>

            <div className="home-actions">
                <Link to="/verbs/1" className="styled-btn">
                    Начать обучение
                </Link>
                <Link to="/grammar" className="home-secondary-link">
                    Моя грамматика
                </Link>
            </div>

            <section className="home-categories" aria-labelledby="home-categories-title">
                <h2 className="home-section-title" id="home-categories-title">
                    Что можно изучать
                </h2>

                <div className="home-grid">
                    <article className="home-feature">
                        <h3>Глаголы иврита</h3>
                        <p>Запоминайте глаголы, их перевод и употребление в повседневной речи.</p>
                        <Link to="/verbs/1">Учить глаголы</Link>
                    </article>

                    <article className="home-feature">
                        <h3>Прилагательные иврита</h3>
                        <p>Расширяйте словарный запас и учитесь описывать людей и предметы.</p>
                        <Link to="/adjectives/1">Учить прилагательные</Link>
                    </article>

                    <article className="home-feature">
                        <h3>Наречия иврита</h3>
                        <p>Изучайте слова, которые помогают точнее выражать мысли на иврите.</p>
                        <Link to="/adverbs/1">Учить наречия</Link>
                    </article>

                    <article className="home-feature">
                        <h3>Тесты и грамматика</h3>
                        <p>
                            Проверяйте знания и сохраняйте интересные слова для грамматического
                            разбора.
                        </p>
                        <Link to="/grammar">Перейти в грамматику</Link>
                    </article>
                </div>
            </section>

            <p className="home-note">
                Начните с первого уровня. Новые уровни открываются по мере успешного прохождения
                тестов.
            </p>
        </main>
    );
}

export default Home;
