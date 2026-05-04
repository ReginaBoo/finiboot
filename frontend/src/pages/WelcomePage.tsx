import { useNavigate } from "react-router-dom";
import "../assets/WelcomePage.scss";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-page__hero">
        <section className="welcome-page__intro">
          <h1 className="welcome-page__title">
            <span className="welcome-page__title--highlight">Fini</span>
            <span className="welcome-page__title--secondary">boot</span>
          </h1>
          <div className="welcome-page__buttons">
            <button onClick={() => navigate("/login")} className="welcome-page__btn">
              Вход
            </button>
            <button onClick={() => navigate("/register")} className="welcome-page__btn">
              Регистрация
            </button>
          </div>
        </section>
      </div>

      <section className="welcome-page__about">
        <h2>О проекте</h2>
        <p>
          <strong>FiniBoot</strong> — это инструмент для инвесторов, который помогает
          планировать доходность облигаций, строить портфель и визуализировать будущие выплаты.
        </p>
        <h3>Стек технологий</h3>
        <p>
          <span className="welcome-page__tech-label">Frontend:</span> React, TypeScript, SCSS<br />
          <span className="welcome-page__tech-label">Backend:</span> Go (Gin, Gorm, PostgreSQL, Docker)
        </p>

        <h3>Минимальный функционал MVP</h3>
        <ul>
          <li>Регистрация и вход с JWT-аутентификацией</li>
          <li>Добавление облигаций в портфель</li>
          <li>Просмотр графика выплат и доходности</li>
          <li>Фильтрация и сортировка бумаг</li>
        </ul>
      </section>
    </div>
  );
}