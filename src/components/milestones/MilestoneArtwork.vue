<script setup>
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
  milestone: null,
  aspectRatio: {
    type: String,
    default: 'portrait',
  },
  width: null,
  height: null
})
</script>

<template>
  <div :class="cn('space-y-3', $attrs.class ?? '')">
    <div class="overflow-hidden rounded-md">
      <RouterLink v-if="milestone" :to="{ path: '/milestone/' + milestone.id }">
        <img :src="milestone.image" :alt="milestone.name" :width="width" :height="height" :class="cn(
          'h-auto w-auto object-cover transition-all hover:scale-105',
          aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
        )">
      </RouterLink>
      <Skeleton v-else class="w-full h-[200px] rounded-md" :width="width" :height="height" :class="cn(
        'h-auto w-auto object-cover transition-all hover:scale-105',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
      )" />
    </div>

    <div class="space-y-1 text-sm">
      <h3 class="font-medium leading-none">
        <Skeleton v-if="!milestone" class="w-1/2 h-5" />
        <span v-else>{{ milestone.name }}</span>
      </h3>
      <p class="text-xs text-muted-foreground">
        <Skeleton v-if="!milestone" class="w-2/3 h-4" />
        <span v-else>{{ milestone.description }}</span>
      </p>
    </div>
  </div>
</template>
