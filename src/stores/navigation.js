import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', () => {
  const currentTab = ref()

  function setCurrentTab(tab) {
    currentTab.value = tab
  }

  const getRoutePath = (route, routeItem) => {
    const matchedSegments = route.matched.slice(0, route.matched.indexOf(routeItem) + 1);
    return matchedSegments.map((segment) => segment.path).join('/');
  }

  function getBreadcrumbs() {
    const route = this.$route;
    const matchedRoutes = route.matched;
    console.log(route)
    return matchedRoutes.map((routeItem) => ({
      label: routeItem.meta.breadcrumb || routeItem.name,
      to: getRoutePath(route, routeItem),
    }));
  }

  return { currentTab, setCurrentTab, getBreadcrumbs }
})
