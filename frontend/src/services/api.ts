import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Criar instância do axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Serviços de autenticação
export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Serviços para técnicos
export const tecnicoService = {
    getOrdens: async () => {
        const response = await api.get('/tecnico/ordens');
        return response.data;
    },

    updateOrdemStatus: async (id: number, data: any) => {
        const response = await api.put(`/tecnico/ordens/${id}/status`, data);
        return response.data;
    },

    getSolicitacoes: async () => {
        const response = await api.get('/tecnico/solicitacoes');
        return response.data;
    },

    getAvaliacao: async () => {
        const response = await api.get('/tecnico/avaliacao');
        return response.data;
    },

    getSugestoes: async (id: number) => {
        const response = await api.get(`/tecnico/sugestoes/${id}`);
        return response.data;
    }
};

export default api;
