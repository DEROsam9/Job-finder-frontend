<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const checked = ref(false);

const loading = ref(false);
const error = ref('');
const success = ref('');

const router = useRouter();

const handleRegister = async () => {
    error.value = '';
    success.value = '';
    loading.value = true;

    if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        loading.value = false;
        return;
    }

    try {
        const response = await axios.post('http://localhost:8000/api/register', {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: confirmPassword.value
        });

        success.value = 'Registration successful! Redirecting...';
        setTimeout(() => {
            //router.push('/');
        }, 1500);
    } catch (err) {
        error.value = err.response?.data?.message || (err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ')) || 'Registration failed.';
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
                        <!-- Optional logo or icon here -->
                        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Create an Account</h2>
                        <p class="text-gray-600 dark:text-gray-400">Sign up to get started</p>
                    </div>

                    <!-- Register Form -->
                    <form @submit.prevent="handleRegister" class="space-y-6 w-full max-w-sm mx-auto">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input v-model="name" type="text" id="name" required class="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>

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

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <input
                                v-model="confirmPassword"
                                type="password"
                                id="confirmPassword"
                                required
                                class="mt-1 w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>
                        <div v-if="success" class="text-sm text-green-600 dark:text-green-400">{{ success }}</div>

                        <button type="submit" class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            {{ loading ? 'Registering...' : 'Register' }}
                        </button>

                        <p class="text-sm text-center text-gray-600 dark:text-gray-400">
                            Already have an account?
                            <router-link to="/auth/login" class="text-primary-600 hover:underline dark:text-primary-400">Login</router-link>
                        </p>
                    </form>
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
