// RegisterForm.tsx
import { useState } from "react";
import axios from "axios";

interface FormProps {
  onSuccess?: () => void; // можно передавать колбэк при успешной регистрации
}

export default function RegisterForm({ onSuccess }: FormProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/auth/register", form, { timeout: 100 });
      setMessage("Регистрация успешна!");
      setForm({ name: "", email: "", password: "" });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Ошибка");
    }
  };

  return {
    form,
    message,
    handleChange,
    handleSubmit,
  };
}
