<script setup>
import { defineProps } from 'vue';
import MilestoneArtwork from './MilestoneArtwork.vue';
import { ScrollBar, ScrollArea } from '../ui/scroll-area';
const props = defineProps({
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
    default: 'portrait'
  },
  isLoading: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <div class="relative">
    <ScrollArea>
      <div class="flex space-x-4 pb-4" v-if="!props.isLoading">
        <MilestoneArtwork v-for="milestone in milestones" :key="milestone.id" :milestone="milestone"
          :class="`w-[${width}px]`" :aspect-ratio="aspectRatio" :width="width" :height="height" />
      </div>
      <div class="flex space-x-4 pb-4" v-else>
        <MilestoneArtwork v-for="index in 5" :key="'skeleton-' + index" :milestone="null" :class="`w-[${width}px]`"
          :aspect-ratio="aspectRatio" :width="width" :height="height" />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>