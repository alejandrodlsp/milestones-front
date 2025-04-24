<script setup>
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { LucideCopyPlus } from 'lucide-vue-next';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/toast";
import { ref, computed } from "vue";
import CreateListButton from "../lists/CreateListButton.vue";
import { useListsStore } from "@/stores/lists";

const props = defineProps({
  milestoneId: {
    type: Number,
    required: true,
  },
});

const isOpen = ref(false);
const selectedLists = ref([]);
const listsStore = useListsStore();

const lists = computed(() => listsStore.lists);

const toggleList = (listId) => {
  if (selectedLists.value.includes(listId)) {
    selectedLists.value = selectedLists.value.filter((id) => id !== listId);
  } else {
    selectedLists.value.push(listId);
  }
};

const confirmAdd = async () => {
  await Promise.all(
    selectedLists.value.map((listId) => {
      console.log(listId)
      listsStore.addMilestoneToList(listId, props.milestoneId)
    })
  );
  toast({ title: "Milestone added to selected lists!" });
  isOpen.value = false;
  selectedLists.value = [];
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <button @click="isOpen = true"
              class="p-2 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <LucideCopyPlus />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Add to your list
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Milestone to Lists</DialogTitle>
        <DialogDescription>Select one or more lists below:</DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[300px] pr-2 space-y-3">
        <div v-for="list in lists" :key="list.id" class="flex items-center gap-2">
          <Checkbox :checked="selectedLists.includes(list.id)" @update:checked="() => toggleList(list.id)"
            id="list-{{ list.id }}" />
          <label :for="'list-' + list.id" class="text-sm">
            {{ list.name }}
          </label>
        </div>

        <div class="mt-5">
          <CreateListButton />
        </div>
      </ScrollArea>

      <DialogFooter class="mt-4">
        <Button variant="outline" @click="isOpen = false">Cancel</Button>
        <Button @click="confirmAdd" :disabled="selectedLists.length === 0">
          Add
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
