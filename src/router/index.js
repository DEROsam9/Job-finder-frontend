import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
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
                    component: () => import('@/views/pages/Customer.vue')
                },
                {
                    path: '/applications',
                    component: () => import('@/views/pages/Application.vue')
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
                }
            ]
        }
    ]
});

// router.beforeEach((to, from, next) => {
//     const auth = useAuthStore();
//     const isLoggedIn = !!auth.token;

//     if (to.meta.requiresAuth && !isLoggedIn) {
//        // return next('/auth/login');
//     }

//     next();
// });

export default router;
