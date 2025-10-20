import { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/auth/register", form);
      console.log(res.data);
      setMessage("Регистрация успешна!")
      setForm({ name: "", email: "", password: "" })
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`${err.response.data.error}`)
      } else {
        setMessage("Ошибка")
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Имя"
        required
      />
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
      <button type="submit">Зарегистрироваться</button>
      {message && <p>{message}</p>}
    </form>
  );
}