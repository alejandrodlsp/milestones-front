<script setup>
import { cn } from '@/lib/utils'

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
      <img :src="milestone.image" :alt="milestone.name" :width="width" :height="height" :class="cn(
        'h-auto w-auto object-cover transition-all hover:scale-105',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
      )">
    </div>
    <div class="space-y-1 text-sm">
      <h3 class="font-medium leading-none">
        {{ milestone.name }}
      </h3>
      <p class="text-xs text-muted-foreground">
        {{ milestone.description }}
      </p>
    </div>
  </div>
</template>