<script setup>
import { Separator } from '@/components/ui/separator'
import { forYouMilestones } from '../example/data/milestones.js'
import MilestoneCarroussel from '@/components/milestones/MilestoneCarroussel.vue';
import { useMilestonesStore } from '@/stores/milestones.js';
import { ref } from 'vue';

const loading = ref(true)
const milestonesStore = useMilestonesStore()
milestonesStore.loadPopularMilestones()
  .then(() => loading.value = false)

</script>

<template>
  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">
        Most Popular
      </h2>
      <p class="text-sm text-muted-foreground">
        Top picks for you. Updated daily.
      </p>
    </div>
  </div>
  <Separator class="my-4" />
  <MilestoneCarroussel :milestones="milestonesStore.popularMilestones" :isLoading="loading" />

  <div class="mt-6 space-y-1">
    <h2 class="text-2xl font-semibold tracking-tight">
      Made for You
    </h2>
    <p class="text-sm text-muted-foreground">
      Your personal recommendations. Updated daily.
    </p>
  </div>
  <Separator class="my-4" />
  <MilestoneCarroussel :milestones="forYouMilestones" :width="150" :height="150" aspect-ratio="square" />
</template>