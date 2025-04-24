<script setup>
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { computed, ref } from 'vue'
import { useFriendStore } from '@/stores/friends'
import Button from './ui/button/Button.vue'

const friendStore = useFriendStore();

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

const isDialogOpen = ref(false)

// Open the dialog
const openDialog = () => {
  isDialogOpen.value = true
  friendStore.loadFriendshipStatus(props.user.id)
}

const statusLabel = computed(() => {
  switch (friendStore.friendshipStatus) {
    case 'sent':
      return 'Friend request sent';
    case 'rejected':
      return 'Friend request rejected';
    default:
      return 'Unknown';
  }
})

const sendFriendRequest = () => {
  friendStore.sendFriendRequest(props.user.id)
  isDialogOpen.value = false
}

const acceptFriendRequest = () => {
  friendStore.acceptFriendRequest(props.user.id)
  isDialogOpen.value = false
}

const removeFriend = () => {
  friendStore.removeFriend(props.user.id)
  isDialogOpen.value = false
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

          <p class="text-sm text-muted-foreground" v-if="friendStore.friendshipStatus === 'accepted'">Friends since: {{
            formatDate(friendStore.friendship?.updated_at) }}</p>
        </div>
      </div>

      <DialogFooter class="flex justify-between">
        <div v-if="friendStore.friendshipStatus === 'sent' || friendStore.friendshipStatus === 'rejected'">
          <span :class="{
            'bg-gray-500': friendStore.friendshipStatus === 'sent',
            'bg-red-500': friendStore.friendshipStatus === 'rejected'
          }" class="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold">
            {{ statusLabel }}
          </span>
        </div>

        <Button :variant="destructive" v-if="friendStore.friendshipStatus === 'accepted'" @click="removeFriend"
          class="w-1/3 bg-red-700">
          Remove friend
        </Button>


        <Button v-if="friendStore.friendshipStatus === 'not_friends'" @click="sendFriendRequest"
          class="w-1/3 bg-blue-500 hover:bg-blue-600">
          Send Friend Request
        </Button>

        <Button v-if="friendStore.friendshipStatus === 'pending'" @click="acceptFriendRequest"
          class="w-1/3 bg-yellow-500 hover:bg-yellow-600">
          Accept Friend Request
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
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
