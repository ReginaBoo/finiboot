import RegisterForm from "../components/forms/RegisterForm";
import { RegisterLoginPageCSS, FormCSS, ButtonRegisterTelegramm, ButtonDisabled, ButtonRegisterSubmit, Field } from "../assets/styles";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { form, message, handleChange, handleSubmit } = RegisterForm({
    onSuccess: () => {
      console.log("Пользователь зарегистрирован");
      navigate("/login");
    },
  });
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
            value={form.name}
            onChange={handleChange}
            placeholder="Имя"
            required
            className={Field}
          />
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
            className={!form.name || !form.email || !form.password
              ? ButtonDisabled
              : ButtonRegisterSubmit}
            disabled={!form.name || !form.email || !form.password}
          >
            Зарегистрироваться
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
