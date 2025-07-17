<script setup>
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const toast = useToast();

import AppMenuItem from './AppMenuItem.vue';

const router = useRouter();

const logout = async () => {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            await axios.post(
                'http://localhost:8000/api/logout',
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        }

        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        toast.add({ severity: 'success', summary: 'Logout Successful', detail: 'You have been logged out.', life: 3000 });

        router.push('/landing');
    } catch (error) {
        console.error('Logout failed:', error);

        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        toast.add({ severity: 'warn', summary: 'Logout Failed', detail: 'Something went wrong.', life: 3000 });

        router.push('/');
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
        label: 'Settings',
        icon: 'pi pi-cog', // Settings gear
        items: [
            {
                label: 'Setting',
                icon: 'pi pi-cog', // Settings
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
