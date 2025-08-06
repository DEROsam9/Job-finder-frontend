<template>
    <div class="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <router-link to="/" class="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                <span class="material-icons text-base">home</span>
            </router-link>
            <span class="text-gray-400 dark:text-gray-500">›</span>

            <template v-for="(item, index) in items" :key="index">
                <router-link :to="item.to" class="transition-colors duration-200 hover:underline" :class="[isActive(item) ? 'text-green-500 font-semibold' : 'text-gray-500 dark:text-gray-400']">
                    {{ item.label }}
                </router-link>

                <span v-if="index < items.length - 1" class="text-gray-400 dark:text-gray-500">›</span>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
    items: Array
});

const route = useRoute();

const isActive = (item) => {
    return route.path === item.to;
};
</script>
