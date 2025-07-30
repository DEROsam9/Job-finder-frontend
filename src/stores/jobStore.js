import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useJobStore = defineStore('jobStore', () => {
    const jobs = ref([]);
    const categories = ref([]);
    const totalJobs = ref(0);
    const currentPage = ref(1);
    const rowsPerPage = ref(8);
    const fetchJobs = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/careers?page=${page}&limit=${rowsPerPage.value}`);
            const responseData = response.response.data;

            jobs.value = responseData.data;
            totalJobs.value = responseData.total;
            currentPage.value = responseData.current_page;
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/job-categories');
            categories.value = response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return {
        fetchAllJobs,
        pagination,
        jobs,
        categories,
        totalJobs,
        currentPage,
        rowsPerPage,
        fetchJobs,
        fetchCategories
    };
});
