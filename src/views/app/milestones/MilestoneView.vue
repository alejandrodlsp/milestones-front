<script setup>
import { ref, watch, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useMilestonesStore } from '@/stores/milestones'
import { useNavigationStore } from '@/stores/navigation';
import UserBadge from '@/components/UserBadge.vue'
import CommentSection from '@/components/milestones/CommentSection.vue'
import CheckpointSection from '@/components/milestones/CheckpointSection.vue'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
})

const navigationStore = useNavigationStore()
const milestoneStore = useMilestonesStore();

const loadData = (id) => {
  navigationStore.setCurrentTab(`milestone-${id}`)
  milestoneStore.getMilestone(id)
}

loadData(props.id)
watch(() => props.id, (newId) => {
  loadData(newId)
})

// Props: Milestone data
const milestone = ref({
  name: "Skydive",
  description: "Experience the ultimate adrenaline rush by completing your first skydive! From saving up for the jump to scheduling the big day, track every step of your journey toward soaring through the skies.",
  image: "https://media.istockphoto.com/id/507497178/photo/skydiving-photo-tandem.jpg?s=612x612&w=0&k=20&c=_Ot_fQJUZTIH3DxEJmToj-mFnX6ZzwLQNmZq3iRSwCQ=",
  dueDate: new Date("2022-12-31"),
  user: {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/100?img=1",
    initials: "JD",
    email: "john@test.com"
  },
  progressCheckpoints: [
    { date: "2022-01-01", description: "Project started", completed: true },
    { date: "2022-06-30", description: "Save up 200 euros", completed: true },
    { date: "2022-06-30", description: "Contact local dropzone", completed: true },
    { date: "2022-12-31", description: "Jump!", completed: false }
  ],
  progressUpdates: [
    { date: "2022-02-15", description: "Started researching best skydiving spots." },
    { date: "2022-07-10", description: "Completed first payment for training." },
    { date: "2022-11-01", description: "Scheduled first jump for December." }
  ]
})

const progress = ref(75)

const formattedDueDate = computed(() => {
  const date = milestoneStore.milestone.due_date;
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
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-6 px-4">
    <div class="md:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl font-bold">
            {{ milestoneStore.milestone.name }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img :src="milestoneStore.milestone.image_url" alt="Milestone"
            class="rounded-lg w-full object-cover max-h-80">

          <p class="text-muted-foreground mt-4">
            {{ milestoneStore.milestone.description }}
          </p>

          <div class="mt-6">
            <p class="text-sm font-semibold">📈 Progress</p>
            <Progress v-model="progress" class="mt-2" />
            <p class="text-sm text-muted-foreground mt-1">{{ progress }}%</p>
          </div>
          <div class="flex justify-end text-gray-600 dark:text-white text-sm p-2 rounded-md mt-1">
            📅 Due date: <span class="ml-1 font-semibold text-gray-800">{{ formattedDueDate }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- 👤 User Info -->
      <Card>
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
            <li v-for="update in milestone.progressUpdates" :key="update.date">
              <p class="text-sm font-medium">{{ update.description }}</p>
              <p class="text-xs text-muted-foreground">📅 {{ update.date }}</p>
              <Separator class="my-2" />
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
