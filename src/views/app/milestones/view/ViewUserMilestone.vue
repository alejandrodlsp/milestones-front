<script setup>
import { useMilestonesStore } from '@/stores/milestones'
import ListsSection from '@/components/milestones/ListsSection.vue'
import UserBadge from '@/components/UserBadge.vue'
import CommentSection from '@/components/milestones/CommentSection.vue'
import CheckpointSection from '@/components/milestones/CheckpointSection.vue'
import CompleteMilestoneDialog from '@/components/milestones/CompleteMilestoneDialog.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { ref, computed, nextTick, getCurrentInstance } from 'vue';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUsersStore } from '@/stores/users'
import ShareCompletionDialog from '@/components/milestones/ShareCompletionDialog.vue'

const milestoneStore = useMilestonesStore()

const completeMilestoneDialogOpen = ref(false)
const deleteMilestoneDialogOpen = ref(false)
const shareCompletionDialogOpen = ref(false)

const userStore = useUsersStore();

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

const canComplete = computed(() => {
  const checkpoints = milestoneStore.milestone.checkpoints || []
  return checkpoints.length === 0 || checkpoints.every(cp => cp.completed_at)
})


function deleteMilestone() {
  alert("TODO")
}

function completeMilestone() {
  showConfetti()
  shareCompletionDialogOpen.value = true;
}

const completionSummary = ref({})

const { appContext } = getCurrentInstance()
const confetti = appContext.config.globalProperties.$confetti

const confettiAvailable = ref(true)
const showConfetti = () => {
  if (!confettiAvailable.value) return;
  confettiAvailable.value = false
  confetti.start();
  setTimeout(() => { confetti.stop() }, 1000) // Confetti duration
  setTimeout(() => { confettiAvailable.value = true }, 5000) // Confetti cooldown
}

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
        <div v-if="milestoneStore.milestone.user && milestoneStore.milestone.user.id != userStore.me.id"
          class="flex justify-end text-gray-600 dark:text-white text-sm p-2 rounded-md mt-1">
          <UserBadge :user="milestoneStore.milestone.user" />
        </div>
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

    <ListsSection :milestone="milestoneStore.milestone" />


    <div class="flex flex-row justify-center align-baseline mt-5 space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div @click="deleteMilestoneDialogOpen = true">
              <Button variant="destructive">
                🗑 Delete Milestone
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            Destroy this milestone, and all the dreams it meant...
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Confirmation Dialog -->
      <Dialog :open="deleteMilestoneDialogOpen" @update:open="val => deleteMilestoneDialogOpen = val">
        <DialogContent class="max-w-lg">
          <DialogHeader>
            <DialogTitle>Are you sure? 😢</DialogTitle>
            <p class="text-sm text-muted-foreground mt-2">
              This action is irreversible. So many dreams will be broken forever... Are you sure you want to delete this
              milestone?
            </p>
          </DialogHeader>

          <DialogFooter class="mt-4">
            <Button variant="outline" @click="deleteMilestoneDialogOpen = false">Cancel</Button>
            <Button variant="destructive" @click="deleteMilestone">Yes, Delete it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <Tooltip v-if="!canComplete">
          <TooltipTrigger as-child>
            <div>
              <Button variant="default" disabled>
                ✅ Mark as Complete
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            You must complete all checkpoints first.
          </TooltipContent>
        </Tooltip>
        <template v-else>
          <Button variant="default" @click="completeMilestoneDialogOpen = true">
            ✅ Mark as Complete
          </Button>
        </template>
      </TooltipProvider>
    </div>
  </div>

  <CompleteMilestoneDialog :open="completeMilestoneDialogOpen"
    @update:open="(value) => completeMilestoneDialogOpen = value" @completed="completeMilestone"
    :milestone_id="milestoneStore.milestone.id" />

  <ShareCompletionDialog :open="shareCompletionDialogOpen" @update:open="(value) => shareCompletionDialogOpen = value"
    :image="completionSummary.files" :summary="completionSummary.summary" />
</template>