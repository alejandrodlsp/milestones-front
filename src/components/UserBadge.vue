<script setup>
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: {
    required: true
  }
})

const userInitials = computed(() => {
  const first = props.user?.first_name?.charAt(0) || ''
  const last = props.user?.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
})

const isDialogOpen = ref(false)  // Dialog open state
const router = useRouter()  // Vue Router instance

// Open the dialog
const openDialog = () => {
  isDialogOpen.value = true
}

// Navigate to the user's profile page
const navigateToProfile = () => {
  router.push({ name: 'user-profile', params: { userId: props.user.id } })  // Adjust based on your route
  isDialogOpen.value = false  // Close the dialog after navigation
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <div v-if="!props.user">
    <div class="flex items-center space-x-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </div>

  <div v-else class="flex items-center space-x-4 cursor-pointer" @click="openDialog">
    <Avatar>
      <AvatarImage :src="props.user?.avatar" />
      <AvatarFallback>{{ userInitials }}</AvatarFallback>
    </Avatar>
    <div>
      <p class="text-sm font-medium">{{ props.user?.first_name }} {{ props.user?.last_name }}</p>
      <p class="text-sm text-muted-foreground">
        <slot>{{ props.user?.email }}</slot>
      </p>
    </div>
  </div>

  <!-- User Info Dialog -->
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="rounded-xl p-6 space-y-4 bg-white border shadow-lg">
      <DialogHeader class="text-center">
        <DialogTitle class="text-xl font-semibold">{{ props.user?.first_name }}'s Profile</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col items-center space-y-3">
        <Avatar class="h-24 w-24">
          <AvatarImage :src="props.user?.avatar" />
          <AvatarFallback>{{ userInitials }}</AvatarFallback>
        </Avatar>

        <div class="text-center space-y-2">
          <p class="text-lg font-semibold">{{ props.user?.first_name }} {{ props.user?.last_name }}</p>
          <p class="text-sm text-muted-foreground">Email: {{ props.user?.email }}</p>
          <p class="text-sm text-muted-foreground">Joined: {{ formatDate(props.user?.join_date) }}</p>
        </div>
      </div>

      <DialogFooter class="flex justify-between">
        <Button @click="navigateToProfile" class="w-1/3">Go to Profile</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
/* Enhancements to make the profile dialog more aesthetic */
.dialog-content {
  max-width: 400px;
  padding: 1rem;
  border-radius: 1.25rem;
  background-color: #fff;
}

.avatar {
  border-radius: 9999px;
  border: 2px solid #f3f4f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar img {
  border-radius: 50%;
}

button {
  transition: all 0.3s;
}

button:hover {
  opacity: 0.8;
}
</style>
