import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login({ name, email, password }) {
            const response = await axios.post('http://localhost:8000/api/login', {
                name,
                email,
                password
            });

            this.token = response.data.token;
            this.user = response.data.user || { name, email };

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        },

        logout() {
            this.token = null;
            this.user = null;
            delete axios.defaults.headers.common['Authorization'];
        }
    },
    persist: {
        storage: localStorage
    }
});
