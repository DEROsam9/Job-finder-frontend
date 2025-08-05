<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios'; // Import axios
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const checked = ref(false);

const loading = ref(false);
const error = ref('');
const success = ref('');

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';

    try {
        // Call your Laravel login API endpoint
        const response = await axios.post('/v1/auth/login', {
            username: email.value,
            password: password.value,
            client_id: import.meta.env.VITE_CLIENT_ID, // or process.env.CLIENT_ID
            client_secret: import.meta.env.VITE_CLIENT_SECRET // make sure these env vars exist and are exposed
        });

        // response.data should contain user info and token
        const { token, user } = response.data;

        // Save token & user in your auth store
        auth.token = token;
        auth.user = user;

        success.value = 'Login successful!';

        router.push('/dashboard');
    } catch (err) {
        // Show backend error message or fallback
        error.value = err?.response?.data?.message || 'Login failed.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <!-- SVG Logo included here -->
                        <!-- ... SVG content ... -->
                        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Welcome Back</h2>
                        <p class="text-gray-600 dark:text-gray-400">Please sign in to your account</p>
                    </div>

                    <!-- Login Form -->
                    <form @submit.prevent="handleLogin" class="space-y-6 w-full max-w-sm mx-auto">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input v-model="email" type="email" id="email" required class="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                v-model="password"
                                type="password"
                                id="password"
                                required
                                class="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div class="flex items-center justify-between">
                            <label class="flex items-center">
                                <input v-model="checked" type="checkbox" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                            </label>
                            <a href="#" class="text-sm text-primary-600 hover:underline dark:text-primary-400">Forgot password?</a>
                        </div>

                        <button type="submit" class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Sign In</button>
                    </form>
                    <div v-if="error" class="mt-4 text-red-600 dark:text-red-400">{{ error }}</div>
                    <div v-if="success" class="mt-4 text-green-600 dark:text-green-400">{{ success }}</div>
                    <hr />
                    <p class="text-sm text-center text-gray-600 dark:text-gray-400">
                        Don't have an account?
                        <router-link to="/auth/register" class="text-primary-600 hover:underline dark:text-primary-400">Register</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
