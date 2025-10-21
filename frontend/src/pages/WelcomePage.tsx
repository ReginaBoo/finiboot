import { useNavigate } from "react-router-dom";
import { ButtonClick, WelcomPageCSS } from "../assets/styles";


export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-[#231136] p-55" >

        <section className={WelcomPageCSS}>
          <div className="text-9xl font-[Sofia-Sans]">
            <span className="text-[#B39BE3]">Fini</span>
            <span className="text-fuchsia-50">boot</span>
          </div>


          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className={ButtonClick}
            >
              Вход
            </button>
            <button
              onClick={() => navigate("/register")}
              className={ButtonClick}
            >
              Регистрация
            </button>
          </div>
        </section>



      </div>
      <section className="bg-gray-30px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-5">О проекте</h2>
        <p className="max-w-3xl mx-auto mb-10">
          <strong>FiniBoot</strong> — это инструмент для инвесторов, который помогает
          планировать доходность облигаций, строить портфель и визуализировать
          будущие выплаты.
        </p>

        <h3 className="text-xl font-semibold mb-5">Стек технологий</h3>
        <p className="max-w-3xl mx-auto mb-10">
          <span className="text-[#B39BE3] font-medium">Frontend:</span> React, TypeScript, Tailwind CSS
          <br />
          <span className="text-[#B39BE3] font-medium">Backend:</span> Go (Gin, Gorm, PostgreSQL, Docker)
          <br />
          <span className="text-[#B39BE3] font-medium">Gateway:</span> API-шлюз для микросервисов
        </p>

        <h3 className="text-xl font-semibold mb-5">Минимальный функционал MVP</h3>
        <ul className="list-disc list-inside max-w-2xl mx-auto text-left">
          <li>Регистрация и вход с JWT-аутентификацией</li>
          <li>Добавление облигаций в портфель</li>
          <li>Просмотр графика выплат и доходности</li>
          <li>Фильтрация и сортировка бумаг</li>
        </ul>
      </section>

    </div>

  );
}