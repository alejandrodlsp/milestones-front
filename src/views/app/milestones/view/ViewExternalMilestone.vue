<script setup>
import AddMilestoneToListModal from '@/components/milestones/AddMilestoneToListModal.vue';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderHeartIcon } from 'lucide-vue-next';
import { useMilestonesStore } from '@/stores/milestones';
import CheckpointSection from '@/components/milestones/CheckpointSection.vue';

const milestoneStore = useMilestonesStore();
</script>

<template>
  <div class="md:col-span-2 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl font-bold flex justify-between items-center">
          <div v-if="isLoading" class="h-6 w-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
          <span v-else>{{ milestoneStore.milestone.name }}</span>
          <AddMilestoneToListModal :milestone-id="milestoneStore.milestone.id" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div v-if="isLoading" class="w-full h-80 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        <img v-else :src="milestoneStore.milestone.image_url" alt="Milestone"
          class="rounded-lg w-full object-cover max-h-80">

        <p class="text-muted-foreground mt-4">
          {{ milestoneStore.milestone.description }}
        </p>
      </CardContent>
    </Card>

    <div class="space-y-6">
      <!-- 📍 Progress Checkpoints -->
      <Card>
        <CheckpointSection :milestone="milestoneStore.milestone" />
      </Card>
    </div>

    <div class="space-y-6" v-if="milestoneStore.milestone.lists?.length">
      <Card>
        <CardContent>
          <!-- If milestone is in lists, show them -->
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-2">This milestone is in your lists:</h3>
            <div class="space-y-2">
              <router-link :to="{ path: '/list/' + list.id }" v-for="list in milestoneStore.milestone.lists"
                :key="list.id"
                class="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <FolderHeartIcon />
                <span class="font-medium">{{ list.name }}</span>
              </router-link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
