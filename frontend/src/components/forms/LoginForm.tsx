import axios from "axios";
import { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", form)

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setMessage("Успешный вход");
      setForm({ email: "", password: "" })
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`${err.response.data.error}`);
      } else {
        setMessage("Ошибка подключения к серверу");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Почта"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Пароль"
        required
      />
      <button type="submit">Войти</button>
      {message && <p>{message}</p>}
    </form>
  );

}