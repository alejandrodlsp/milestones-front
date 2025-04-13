<script setup>
import { ref, watch } from 'vue'
import { useMilestonesStore } from '@/stores/milestones'
import { useNavigationStore } from '@/stores/navigation';
import ViewUserMilestone from './view/ViewUserMilestone.vue';
import ViewExternalMilestone from './view/ViewExternalMilestone.vue';
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
})

const navigationStore = useNavigationStore()
const milestoneStore = useMilestonesStore();

const isLoading = ref(true)
const loadData = (id) => {
  isLoading.value = true;
  navigationStore.setCurrentTab(`milestone-${id}`)
  milestoneStore.getMilestone(id).finally(() =>
    isLoading.value = false
  )
}

loadData(props.id)
watch(() => props.id, (newId) => {
  loadData(newId)
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-6 px-4">
    <ViewUserMilestone v-if="milestoneStore.milestone.user" />
    <ViewExternalMilestone v-else />
  </div>
</template>
