import axios from "axios";
import { useState } from "react";


interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps = {}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", form)

      const { access_token, refresh_token } = res.data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      setMessage("Успешный вход");
      setForm({ email: "", password: "" })
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`${err.response.data.error}`);
      } else {
        setMessage("Ошибка подключения к серверу");
      }
    }
  };

  return { form, message, handleChange, handleSubmit };
}