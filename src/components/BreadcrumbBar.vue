<script setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useRoute } from 'vue-router'
import { computed, ref, watchEffect } from 'vue'
import { useListsStore } from '@/stores/lists';
import { useMilestonesStore } from '@/stores/milestones';
import { useCategoriesStore } from '@/stores/categories';

// Define valid routes that should trigger dynamic breadcrumbs
const entityRoutes = {
  list_view: 'lists',
  milestone_view: 'milestones',
  category_view: 'categories'
};

// Map entity types to their stores
const stores = {
  lists: useListsStore(),
  milestones: useMilestonesStore(),
  categories: useCategoriesStore()
};

// Define the key to access each entity's name inside the store
const entityKeys = {
  lists: 'list',
  milestones: 'milestone',
  categories: 'category'
};

const route = useRoute();
const entityName = ref(null);

// Function to get the entity type from the route name
const getEntityType = () => entityRoutes[route.name] || null;

// Watch for route changes and update entityName dynamically
watchEffect(() => {
  const entityType = getEntityType();
  if (entityType && route.params.id) {
    const store = stores[entityType];  // Get the correct store
    const entityKey = entityKeys[entityType]; // Get the correct property name
    if (store && store[entityKey]) {
      entityName.value = store[entityKey].name; // Dynamically fetch name
    }
  }
});

const breadcrumbs = computed(() => {
  return route.matched.map(r => {
    const entityType = getEntityType();
    if (entityType && r.name === route.name && entityName.value) {
      return { label: entityName.value, route: r.name };
    }
    if (r.meta.breadcrumb) {
      return {
        label: r.meta.breadcrumb.label,
        route: r.meta.breadcrumb.routeName
      };
    }
    return null;
  }).filter(Boolean);
});
</script>


<template>
  <Breadcrumb v-if="breadcrumbs.length > 1">
    <BreadcrumbList>
      <BreadcrumbItem v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.route">
        <router-link v-if="breadcrumb.route && index < breadcrumbs.length - 1"
          :to="{ name: breadcrumb.route, params: route.params }">
          {{ breadcrumb.label }}
        </router-link>
        <span v-else>{{ breadcrumb.label }}</span>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>