<script setup>
import { computed } from 'vue'
import { useMilestonesStore } from '@/stores/milestones'
import ListsSection from '@/components/milestones/ListsSection.vue'
import UserBadge from '@/components/UserBadge.vue'
import CommentSection from '@/components/milestones/CommentSection.vue'
import CheckpointSection from '@/components/milestones/CheckpointSection.vue'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const milestoneStore = useMilestonesStore()

const progress = computed(() => {
  const checkpoints = milestoneStore.milestone.checkpoints || []
  const totalCheckpoints = checkpoints.length
  const completedCheckpoints = checkpoints.filter((checkpoint) => checkpoint.completed_at).length
  return totalCheckpoints === 0 ? 100 : (completedCheckpoints / totalCheckpoints) * 100
})

const formattedDueDate = computed(() => {
  const date = milestoneStore.milestone?.due_date;
  return date
    ? new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date))
    : 'No due date';
});
</script>

<template>
  <div class="md:col-span-2 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl font-bold">
          <div v-if="isLoading" class="h-6 w-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
          <span v-else>{{ milestoneStore.milestone.name }}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="w-full h-80 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        <img v-else :src="milestoneStore.milestone.image_url" alt="Milestone"
          class="rounded-lg w-full object-cover max-h-80">

        <p class="text-muted-foreground mt-4">
          {{ milestoneStore.milestone.description }}
        </p>

        <div class="mt-6" v-if="milestoneStore.milestone.checkpoints?.length > 0">
          <p class="text-sm font-semibold">📈 Progress</p>
          <Progress v-model="progress" class="mt-2" />
          <p class="text-sm text-muted-foreground mt-1">{{ progress }}%</p>
        </div>
        <div v-if="milestoneStore.milestone.due_date"
          class="flex justify-end text-gray-600 dark:text-white text-sm p-2 rounded-md mt-1">
          📅 Due date: <span class="ml-1 font-semibold text-gray-800">{{ formattedDueDate }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- 👤 User Info -->
    <Card v-if="milestoneStore.milestone.user">
      <CardHeader>
        <CardTitle class="text-lg">Created by</CardTitle>
      </CardHeader>
      <CardContent class="flex items-center space-x-4">
        <UserBadge :user="milestoneStore.milestone.user" />
      </CardContent>
    </Card>

    <!-- 💬 Comments Section -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">💭 Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <CommentSection :milestone="milestoneStore.milestone" />
      </CardContent>
    </Card>
  </div>

  <!-- ✅ RIGHT COLUMN (Progress Details) -->
  <div class="space-y-6">
    <!-- 📍 Progress Checkpoints -->
    <Card>
      <CheckpointSection :milestone="milestoneStore.milestone" />
    </Card>

    <!-- 🚀 Progress Updates -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">🔄 Progress Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-3">
          <li v-for="update in milestoneStore.milestone.progressUpdates" :key="update.date">
            <p class="text-sm font-medium">{{ update.description }}</p>
            <p class="text-xs text-muted-foreground">📅 {{ update.date }}</p>
            <Separator class="my-2" />
          </li>
        </ul>
      </CardContent>
    </Card>

    <ListsSection :milestone="milestoneStore.milestone" />
  </div>
</template>