<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            await axios.post(
                'http://localhost:8000/api/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }

        // Clear token and any auth state
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        // Redirect to landing page
        router.push('/');
    } catch (error) {
        console.error('Logout failed:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/');
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
                    //{ label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/auth/login' },
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
