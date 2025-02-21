import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', () => {
  const currentTab = ref()

  function setCurrentTab(tab) {
    currentTab.value = tab
  }

  return { currentTab, setCurrentTab }
})
