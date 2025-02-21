<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

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

// Mocked Comments
const comments = ref([
  { user: "Paula Smith", text: "Great progress! Keep it up.", avatar: "https://i.pravatar.cc/100?img=5" },
  { user: "Antonio Rivas", text: "Looking forward to your next update.", avatar: "https://i.pravatar.cc/100?img=10" }
])

const progress = ref(75)
const newComment = ref("")
// Add comment function
const addComment = () => {
  if (!newComment.value.trim()) return
  comments.value.push({ user: "You", text: newComment.value, avatar: "https://i.pravatar.cc/100?img=15" })
  newComment.value = ""
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-6 px-4">
    <!-- LEFT COLUMN (Milestone, User Info, Comments) -->
    <div class="md:col-span-2 space-y-6">
      <!-- Milestone Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl font-bold">
            {{ milestone.name }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Image -->
          <img :src="milestone.image" alt="Milestone" class="rounded-lg w-full object-cover max-h-80">

          <!-- Description -->
          <p class="text-muted-foreground mt-4">
            {{ milestone.description }}
          </p>

          <!-- Progress Bar -->
          <div class="mt-6">
            <p class="text-sm font-semibold">Progress</p>
            <Progress v-model="progress" class="mt-2" />
            <p class="text-sm text-muted-foreground mt-1">{{ progress }}%</p>
          </div>
        </CardContent>
      </Card>

      <!-- User Info -->
      <Card>
        <CardContent class="flex items-center space-x-4 pt-5">
          <Avatar>
            <AvatarImage :src="milestone.user.avatar" />
            <AvatarFallback>{{ milestone.user.initials }}</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium">{{ milestone.user.name }}</p>
            <p class="text-sm text-muted-foreground">{{ milestone.user.email }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Comments Section -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-52 overflow-y-auto">
            <div v-for="(comment, index) in comments" :key="index" class="flex items-start space-x-3 mb-4">
              <Avatar>
                <AvatarImage :src="comment.avatar" />
                <AvatarFallback>{{ comment.user[0] }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="font-medium text-sm">{{ comment.user }}</p>
                <p class="text-sm text-muted-foreground">{{ comment.text }}</p>
              </div>
            </div>
          </ScrollArea>

          <Separator class="my-4" />

          <!-- New Comment -->
          <div class="space-y-2">
            <Textarea v-model="newComment" placeholder="Write a comment..." class="w-full" />
            <Button @click="addComment" class="w-full">Post Comment</Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- RIGHT COLUMN (Progress Details) -->
    <div class="space-y-6">
      <!-- Progress Checkpoints -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Progress Checkpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3">
            <li v-for="checkpoint in milestone.progressCheckpoints" :key="checkpoint.date"
              class="flex items-center space-x-3">
              <Badge :variant="checkpoint.completed ? 'success' : 'destructive'">
                {{ checkpoint.completed ? "✔" : "✘" }}
              </Badge>
              <div>
                <p class="text-sm font-medium">{{ checkpoint.description }}</p>
                <p class="text-xs text-muted-foreground">{{ checkpoint.date }}</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Progress Updates -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Progress Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3">
            <li v-for="update in milestone.progressUpdates" :key="update.date">
              <p class="text-sm font-medium">{{ update.description }}</p>
              <p class="text-xs text-muted-foreground">{{ update.date }}</p>
              <Separator class="my-2" />
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
