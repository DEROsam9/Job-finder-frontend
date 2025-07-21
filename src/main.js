import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { useAuthStore } from '@/stores/auth';
import Aura from '@primeuix/themes/aura';
import axios from 'axios';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
const pinia = createPinia();
pinia.use(piniaPersistedstate);

// Enable persisted state for Pinia

app.use(pinia);

const auth = useAuthStore();

if (auth.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
}

// ✅ Only mount router *after* auth is ready
app.use(router);
app.mount('#app');
