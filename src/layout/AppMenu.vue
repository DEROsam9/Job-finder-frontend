<script setup>
import { useAuthStore } from '@/stores/auth'; // <-- ADD THIS
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const toast = useToast();

import AppMenuItem from './AppMenuItem.vue';

const router = useRouter();

const logout = async () => {
    console.log('Logout started'); // test log

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
            await router.push('/auth/login');
        } catch (err) {
            console.error('Error during toast or navigation:', err);
        }
    }
};

const model = ref([
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-home', // Home icon
                to: '/dashboard'
            }
            // {
            //     label: 'Landing',
            //     icon: 'pi pi-fw pi-globe',
            //     to: '/landing'
            // }
        ]
    },

    {
        label: 'Customers',
        icon: 'pi pi-users', // Group of people icon
        to: '/customer',
        items: [
            {
                label: 'Customers',
                icon: 'pi pi-user', // Single user icon
                to: '/customers'
            },
            {
                label: 'Application',
                icon: 'pi pi-file-edit', // Form or application
                to: '/applications'
            }
        ]
    },
    {
        label: 'Job',
        items: [
            {
                label: 'Categories',
                icon: 'pi pi-tags', // Tag icon for categories
                to: '/category'
            },
            {
                label: 'Jobs',
                icon: 'pi pi-briefcase', // Job or work
                to: '/jobs'
            }
        ]
    },
    {
        label: 'Application Payments',
        items: [
            {
                label: 'Payments',
                icon: 'pi pi-money-bill', // Money bill icon for payments
                to: '/payments'
            }
            // {
            //     label: 'Payment Methods',
            //     icon: 'pi pi-credit-card', // Credit card icon for payment methods
            //     to: '/payment-methods'
            // }
        ]
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog', // Settings gear
        items: [
        {
                label: 'Users',
                icon: 'pi pi-users', 
                to: '/users'
            },
            {
                label: 'Setting',
                icon: 'pi pi-spin pi-cog', // Settings
                to: '/setting'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out', // Logout arrow
                command: logout
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
