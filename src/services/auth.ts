import response from '@/services/lib/response';
import { ApiResponse } from '@/types/services';

const { VITE_API_URL } = import.meta.env;

export const login = async (
  email: string,
  password: string,
): Promise<ApiResponse<string>> => {
  const query = `
    mutation {
      login(email: "${email}", password: "${password}") {
        token
      }
    }
  `;

  try {
    const fetchResponse = await fetch(VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await fetchResponse.json();
    const fetchedToken = result.data?.login?.token;

    if (fetchedToken) {
      localStorage.setItem('token', fetchedToken);
      return response(true, null, fetchedToken);
    }

    return response(false, result.errors[0].message);
  } catch (error) {
    const errorMessage = (error as Error).message || 'Login error';
    return response(false, errorMessage);
  }
};

export const register = async (
  email: string,
  password: string,
): Promise<ApiResponse<string>> => {
  const query = `
    mutation {
      register(email: "${email}", password: "${password}") {
        token
      }
    }
  `;

  try {
    const fetchResponse = await fetch(VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await fetchResponse.json();
    const fetchedToken = result.data?.register?.token;

    if (fetchedToken) {
      localStorage.setItem('token', fetchedToken);
      return response(true, null, fetchedToken);
    }

    return response(false, result.errors[0].message);
  } catch (error) {
    const errorMessage = (error as Error).message || 'Registration error';
    return response(false, errorMessage);
  }
};

export const logout = () => localStorage.removeItem('token');
