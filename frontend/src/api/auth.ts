import API from './axios'

export const getCSRFToken = () => API.get('/sanctum/csrf-cookie')

export const login = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Đăng nhập thất bại');
  return await response.json();
};

export const logout = async () => {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
