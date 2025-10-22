import LoginForm from "../components/forms/LoginForm";
import { RegisterLoginPageCSS, FormCSS, ButtonRegisterTelegramm, ButtonDisabled, ButtonRegisterSubmit, Field } from "../assets/styles";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { form, message, handleChange, handleSubmit } = LoginForm({
    onSuccess: () => { navigate("/bonds"); }
  });

  return (
    <div className={RegisterLoginPageCSS}>
      <div className={FormCSS}>
        <h1 className="text-3xl mb-5 text-center">С возвращением!</h1>
        <div className="flex justify-center ">
          <button className={ButtonRegisterTelegramm}>Войти с помощью телеграмма</button>
        </div>
        <p className="text-sm text-center mt-5 font-semibold">или</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full text-[#482A69] text-md"
        >
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Почта"
            required
            className={Field}
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
            className={Field}
          />
          <button
            type="submit"
            className={!form.email || !form.password
              ? ButtonDisabled
              : ButtonRegisterSubmit}
            disabled={!form.email || !form.password}
          >
            Войти
          </button>

          {message && <p className="text-center mt-2">{message}</p>}
        </form >
        <div className="flex flex-row justify-center gap-5 mt-5 text-sm ">
          <p>Нет аккаунта?</p>
          <Link to="/register" className="font-bold">Зарегистрироваться</Link>
        </div>
      </div>

    </div >
  );
}