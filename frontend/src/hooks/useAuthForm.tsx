import { useState } from 'react';
import { authService } from '../api/authService';
import type { LoginData, RegisterData } from '../types/auth';
import { setTokens } from "../api/token";
import { useNotificationContext } from '../components/context/NotificationContext';

type AuthMode = 'login' | 'register';

interface UseAuthFormProps {
  mode: AuthMode;
  onSuccess?: () => void;
}

export const useAuthForm = ({ mode, onSuccess }: UseAuthFormProps) => {
  const [form, setForm] = useState<LoginData | RegisterData>(
    mode === 'register'
      ? { name: '', email: '', password: '' }
      : { email: '', password: '' }
  );

  const { showNotification } = useNotificationContext();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (message) setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (mode === 'register') {
        await authService.register(form as RegisterData);
        showNotification("Регистрация прошла успешно!", 'success');
        onSuccess?.();
      } else {
        const { access_token, refresh_token } = await authService.login(form as LoginData);

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        setTokens(access_token, refresh_token)
        showNotification("Вход выполнен успешно!", 'success');
        onSuccess?.();
      }

      setForm(
        mode === 'register'
          ? { name: '', email: '', password: '' }
          : { email: '', password: '' }
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.error ||
        err.message ||
        `Ошибка ${mode === 'register' ? 'регистрации' : 'входа'}`;
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = mode === 'register'
    ? (form as RegisterData).name.trim() && form.email.trim() && form.password.trim()
    : form.email.trim() && form.password.trim();

  return {
    form,
    message,
    isLoading,
    handleChange,
    handleSubmit,
    isFormValid,
    mode
  };
};