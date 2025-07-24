import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/logout',
            name: 'logout',
            component: () => import('@/views/pages/auth/Logout.vue')
        },
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: '/dashboard'
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/customers',
                    component: () => import('@/views/pages/tables/Customer.vue')
                },
                {
                    path: '/applications',
                    name: 'applications',
                    component: () => import('@/views/pages/tables/Application.vue')
                },

                {
                    path: '/category',
                    component: () => import('@/views/pages/Category.vue')
                },
                {
                    path: '/category/create',
                    name: 'CategoryCreate',
                    component: () => import('@/views/pages/CategoryCreate.vue')
                },
                {
                    path: '/category/edit/:id',
                    name: 'CategoryEdit',
                    component: () => import('@/views/pages/CategoryEdit.vue')
                },
                {
                    path: '/jobs',
                    component: () => import('@/views/pages/Jobs.vue')
                },
                {
                    path: '/jobs/create',
                    name: 'JobsCreate',
                    component: () => import('@/views/pages/JobsCreate.vue')
                },
                {
                    path: '/jobs/edit/:id',
                    name: 'JobsEdit',
                    component: () => import('@/views/pages/JobsEdit.vue')
                },
                {
                    path: '/setting',
                    component: () => import('@/views/pages/Setting.vue')
                },
                {
                    path: '/landing',
                    name: 'landing',
                    component: () => import('@/views/pages/Landing.vue')
                },
                {
                    path: '/applications/:id',
                    name: 'application.view',
                    component: () => import('@/views/pages/views/ApplicationView.vue')
                },
                {
                    path: '/applications/:id/edit',
                    name: 'application.edit',
                    component: () => import('@/views/pages/forms/ApplicationEdit.vue')
                },
                {
                    path: '/payments',
                    name: 'Payments',
                    component: () => import('@/views/pages/tables/Payment.vue')
                }
            ]
        }
    ]
});

router.beforeEach(async (to, from) => {
    const auth = useAuthStore();

    // ✅ Wait until Pinia hydration completes
    while (auth.token === undefined) {
        await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // console.log('[Router Guard] to:', to.name, '| from:', from.name, '| token:', auth.token);

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: 'login' };
    }

    if (to.name === 'login' && auth.isAuthenticated) {
        return { name: 'dashboard' };
    }

    return true;
});

export default router;
