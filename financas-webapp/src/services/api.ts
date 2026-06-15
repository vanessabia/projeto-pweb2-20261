import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // [cite: 111]
});

// Interceptor para injetar o Token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Busca o token que você salvou no localStorage durante o login
    // Nota: Se você salvou o objeto do usuário inteiro dentro de um JSON, 
    // ajuste para pegar a string correta (ex: JSON.parse(user).token)
    const token = localStorage.getItem("token");

    // Se o token existir, injeta ele no cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);