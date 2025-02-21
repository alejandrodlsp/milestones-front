<script setup>
import { defineProps } from 'vue';
import MilestoneArtwork from './MilestoneArtwork.vue';

defineProps({
  milestones: {
    require: true,
  },
  width: {
    type: Number,
    default: 250,
  },
  height: {
    type: Number,
    default: 330,
  },
  aspectRatio: {
    type: String,
    default: 'portrait', // portrait, square
  },
})
</script>

<template>
  <div class="relative">
    <ScrollArea>
      <div class="flex space-x-4 pb-4">
        <MilestoneArtwork v-for="milestone in milestones" :key="milestone.id" :milestone="milestone"
          :class="`w-[${width}px]`" :aspect-ratio="aspectRatio" :width="width" :height="height" />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>