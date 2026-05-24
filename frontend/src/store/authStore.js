import { create } from 'zustand';
import api from '../api/client';

const stored = JSON.parse(localStorage.getItem('wp_user') || 'null');

export const useAuth = create((set) => ({
  user:  stored,
  token: localStorage.getItem('wp_token'),

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data); set({ user: data.user, token: data.token });
  },
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    persist(data); set({ user: data.user, token: data.token });
  },
  logout() {
    localStorage.removeItem('wp_token');
    localStorage.removeItem('wp_user');
    set({ user: null, token: null });
  },
}));

function persist(d) {
  localStorage.setItem('wp_token', d.token);
  localStorage.setItem('wp_user', JSON.stringify(d.user));
}
