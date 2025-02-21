import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])

  function loadCategories() {
    return securedHttp.get("/api/v1/categories").then(response => {
      categories.value = response.data;
    }).catch(error => {
      toast({
        title: 'Failed to fetch categories',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  return { categories, loadCategories }
})
