import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosClient from '@/axiosClient'

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories  = ref([])
  const totalPages  = ref(1)
  const currentPage = ref(1)

  const fetchCategories = async (page = 1) => {
    try {
      const response = await axiosClient.get(`/v1/job-categories?page=${page}`)
      const res      = response.data

      // 1️⃣ Your array of items is in res.data
      categories.value  = Array.isArray(res.data) ? res.data : []

      // 2️⃣ Pagination fields are also at the root of res
      totalPages.value  = typeof res.last_page    === 'number' ? res.last_page    : 1
      currentPage.value = typeof res.current_page === 'number' ? res.current_page : 1

    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  return {
    categories,
    totalPages,
    currentPage,
    fetchCategories
  }
})


