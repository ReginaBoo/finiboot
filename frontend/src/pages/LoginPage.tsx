import { RegisterLoginPageCSS, FormCSS, ButtonRegisterTelegramm, ButtonDisabled, ButtonRegisterSubmit, Field } from "../assets/styles";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const { form, message, handleChange, handleSubmit, isLoading, isFormValid } = useAuthForm({
    mode: 'login',
    onSuccess: () => { navigate("/bonds"); }
  });

  const loginForm = form as { email: string; password: string };


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
            value={loginForm.email}
            onChange={handleChange}
            placeholder="Почта"
            required
            disabled={isLoading}
            className={Field}
          />
          <input
            name="password"
            type="password"
            value={loginForm.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
            disabled={isLoading}
            className={Field}
          />
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={!isFormValid || isLoading ? ButtonDisabled : ButtonRegisterSubmit}
          >
            {isLoading ? 'Вход...' : 'Войти'}
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