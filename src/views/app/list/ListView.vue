<script setup>
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator'
import { useListsStore } from "@/stores/lists";
import { computed, watch } from "vue";
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
})

import { useNavigationStore } from '@/stores/navigation';

const navigationStore = useNavigationStore()
navigationStore.setCurrentTab(`list-${props.id}`)

const listStore = useListsStore();
listStore.getListDetails(props.id)

const list = computed(() => listStore.list)

watch(() => props.id, (newId) => {
  navigationStore.setCurrentTab(`list-${newId}`)
  listStore.getListDetails(newId)
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">
        {{ list.name }}
      </h2>
      <p class="text-sm text-muted-foreground">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque accusamus sit quia! Molestiae voluptatibus
        voluptas accusamus. Minima deleniti obcaecati, minus sed excepturi assumenda tenetur qui veritatis sit
        voluptatem praesentium voluptatibus!
      </p>
    </div>
  </div>
  <Separator class="my-4" />
  <div class="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
    <div class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round"
        strokeLinejoin="round" strokeWidth="2" class="h-10 w-10 text-muted-foreground" viewBox="0 0 24 24">
        <circle cx="12" cy="11" r="1" />
        <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
        <path d="M17 18.5a9 9 0 1 0-10 0" />
      </svg>

      <h3 class="mt-4 text-lg font-semibold">
        No milestones added
      </h3>
      <p class="mb-4 mt-2 text-sm text-muted-foreground">
        You have not added any milestones. Add one below.
      </p>
      <Button size="sm" class="relative">
        Add Milestone
      </Button>
    </div>
  </div>
</template>