import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosClient from '@/axiosClient'

export const useCategoryStore = defineStore('categoryStore', () => {
  const categories = ref([])
  const totalPages = ref(1)
  const currentPage = ref(1)

  // const fetchCategories = async (page = 1) => {
  //   try {
  //     const response = await axiosClient.get(`/v1/job-categories?page=${page}`)
  //     categories.value = response.data.data   
  //     totalPages.value = response.data.meta.last_page
  //     currentPage.value = response.data.meta.current_page
  //   } catch (error) {
  //     console.error('Error fetching categories:', error)
  //   }
  // }
  const fetchCategories = async () => {
  try {
    const response = await axiosClient.get(`/v1/job-categories`)
    categories.value = response.data   // Direct array
    totalPages.value = 1               // No pagination
    currentPage.value = 1
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
