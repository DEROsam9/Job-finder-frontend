<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();

import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
    console.log('Logout started'); // Add this test log

    const auth = useAuthStore();

    try {
        if (auth.token) {
            await axios.post(
                'http://localhost:8000/api/v1/auth/logout',
                {},
                {
                    headers: { Authorization: `Bearer ${auth.token}` }
                }
            );
        }
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        auth.logout();
        console.log('After logout: token=', auth.token, 'isAuthenticated=', auth.isAuthenticated);

        try {
            toast.add({ severity: 'success', summary: 'Logged out', detail: 'You have been logged out.', life: 3000 });
            await router.push('/v1/auth/login');
        } catch (err) {
            console.error('Error during toast or navigation:', err);
        }
    }
};

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
    },
    {
        label: 'Pages',
        items: [
            {
                label: 'Auth',
                items: [
                    { label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/auth/login' },
                    { label: 'Register', icon: 'pi pi-fw pi-user-plus', to: '/auth/register' },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-out',
                        command: logout
                    },
                    { label: 'Error', icon: 'pi pi-fw pi-times-circle', to: '/auth/error' },
                    { label: 'Access Denied', icon: 'pi pi-fw pi-lock', to: '/auth/access' }
                ]
            }
        ]
    }
    // ... rest of model
]);
</script>
