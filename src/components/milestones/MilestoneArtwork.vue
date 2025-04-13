<script setup>
import { ref } from 'vue';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const props = defineProps({
  milestone: null,
  aspectRatio: {
    type: String,
    default: 'portrait',
  },
  width: null,
  height: null
});

const imageLoaded = ref(false);

const handleImageLoad = () => {
  imageLoaded.value = true;
};
</script>

<template>
  <div :class="cn('space-y-3', $attrs.class ?? '')">
    <div class="overflow-hidden rounded-md relative">
      <RouterLink v-if="props.milestone" :to="{ path: '/milestone/' + milestone.id }">
        <!-- Show Skeleton until image is fully loaded -->
        <Skeleton v-if="!imageLoaded" class="w-full h-[200px] rounded-md" :width="width" :height="height" />

        <img :src="milestone.image_url" :alt="milestone.name" :width="width" :height="height" :class="cn(
          'h-auto w-auto object-cover transition-all hover:scale-105',
          aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
          !imageLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'
        )" @load="handleImageLoad" />
      </RouterLink>
      <Skeleton v-else class="w-full h-[300px] rounded-md" :width="width" :height="height" />
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
