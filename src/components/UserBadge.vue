<script setup>
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { computed } from 'vue'

const props = defineProps({
  user: {
    required: true
  }
})

const userInitials = computed(() => {
  const first = props.user?.first_name?.charAt(0) || '';
  const last = props.user?.last_name?.charAt(0) || '';
  return (first + last).toUpperCase();
});
</script>

<template>
  <div v-if="!user">
    <div class="flex items-center space-x-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </div>

  <div v-else class="flex items-center space-x-4">
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
</template>
