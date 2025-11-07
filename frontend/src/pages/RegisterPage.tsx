import { RegisterLoginPageCSS, FormCSS, ButtonRegisterTelegramm, ButtonDisabled, ButtonRegisterSubmit, Field } from "../assets/styles";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { form, message, isLoading, handleChange, handleSubmit, isFormValid } = useAuthForm({
    mode: 'register',
    onSuccess: () => navigate("/login")
  });

  const registerForm = form as { name: string; email: string; password: string };

  return (
    <div className={RegisterLoginPageCSS}>
      <div className={FormCSS}>
        <h1 className="text-3xl mb-1 text-center">Добро пожаловать!</h1>
        <p className=" text-sm mb-5 text-center ">Пожалуйста, зарегистрируйтесь</p>
        <div className="flex justify-center ">
          <button className={ButtonRegisterTelegramm}>с помощью телеграмма</button>
        </div>
        <p className="text-sm text-center mt-5 font-semibold">или</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full text-[#482A69] text-md"
        >
          <input
            name="name"
            value={registerForm.name}
            onChange={handleChange}
            placeholder="Имя"
            required
            disabled={isLoading}
            className={Field}
          />
          <input
            name="email"
            type="email"
            value={registerForm.email}
            onChange={handleChange}
            placeholder="Почта"
            required
            disabled={isLoading}
            className={Field}
          />
          <input
            name="password"
            type="password"
            value={registerForm.password}
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
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          {message && <p className="text-center mt-2">{message}</p>}
        </form >
        <div className="flex flex-row justify-center gap-5 mt-5 text-sm ">
          <p>Уже есть аккаунт?</p>
          <Link to="/login" className="font-bold">Вход</Link>
        </div>
      </div>

    </div >
  );
}
