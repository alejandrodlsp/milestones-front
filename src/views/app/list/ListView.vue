<script setup>
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useListsStore } from "@/stores/lists";
import { computed, watch, ref } from "vue";
import MilestoneArtwork from "@/components/milestones/MilestoneArtwork.vue";
import { useNavigationStore } from "@/stores/navigation";
import { LucideTrash2, LucidePencil, LucideCheck, LucideX, LucidePlus } from "lucide-vue-next";
import { toast } from '@/components/ui/toast'
import { z } from "zod";
import router from "@/router";
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const navigationStore = useNavigationStore();
navigationStore.setCurrentTab(`list-${props.id}`);

const listStore = useListsStore();
listStore.getListDetails(props.id);

const list = computed(() => listStore.list);

// Editable fields
const editedName = ref("");
const editedDescription = ref("");
const isEditing = ref(false);
const isDeleteDialogOpen = ref(false);
const errors = ref({ name: "", description: "" });

watch(list, (newList) => {
  if (newList) {
    editedName.value = newList.name;
    editedDescription.value = newList.description;
  }
});

watch(() => props.id, (newId) => {
  navigationStore.setCurrentTab(`list-${newId}`);
  listStore.getListDetails(newId);
});

const startEditing = () => {
  isEditing.value = true;
};

const listSchema = z.object({
  name: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long" }),
});

const saveChanges = async () => {
  const validationResult = listSchema.safeParse({
    name: editedName.value,
    description: editedDescription.value,
  });

  if (!validationResult.success) {
    errors.value = {
      name: validationResult.error.errors.find((err) => err.path[0] === "name")?.message || "",
      description: validationResult.error.errors.find((err) => err.path[0] === "description")?.message || "",
    };
    return;
  }

  await listStore.updateList(props.id, {
    name: editedName.value,
    description: editedDescription.value,
  });
  toast.add({ title: "List updated successfully!" });
  isEditing.value = false;
  errors.value = { name: "", description: "" };
};

// Cancel edit mode
const cancelEditing = () => {
  editedName.value = list.value.name;
  editedDescription.value = list.value.description;
  isEditing.value = false;
  errors.value = { name: "", description: "" };
};

// Delete list
const deleteList = async () => {
  listStore.deleteList(props.id).then(() => {
    toast({
      title: 'List deleted successfully',
    })
    router.replace({ path: '/' })
  }).finally(() => {
    isDeleteDialogOpen.value = false;
  })
};

// Add new milestone
const addMilestone = async () => {
  alert("TODO")
};
</script>


<template>
  <div class="flex items-center justify-between">
    <div class="space-y-2 w-full">
      <!-- Normal Display Mode -->
      <div v-if="!isEditing">
        <h2 class="text-2xl font-semibold tracking-tight">
          {{ list.name }}
        </h2>
        <p class="text-sm text-muted-foreground">
          {{ list.description }}
        </p>
      </div>

      <!-- Edit Mode -->
      <div v-else>
        <Input v-model="editedName" class="text-2xl mt-3 font-semibold tracking-tight" />
        <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p> <!-- Show name error -->

        <Textarea v-model="editedDescription" class="text-sm mt-3 text-muted-foreground" rows="2" />
        <p v-if="errors.description" class="text-sm text-red-500">{{ errors.description }}</p>
        <!-- Show description error -->

        <div class="mt-2 flex gap-2">
          <Button size="sm" variant="default" @click="saveChanges">
            <LucideCheck class="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" @click="cancelEditing">
            <LucideX class="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    </div>

    <div class="flex gap-2">
      <!-- Edit Button -->
      <Button variant="outline" size="icon" @click="startEditing" v-if="!isEditing">
        <LucidePencil class="w-4 h-4" />
      </Button>

      <!-- Delete Button with Dialog -->
      <Dialog v-model:open="isDeleteDialogOpen" v-if="!isEditing">
        <DialogTrigger as-child>
          <Button variant="destructive" size="icon">
            <LucideTrash2 class="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="isDeleteDialogOpen = false">
              Cancel
            </Button>
            <Button variant="destructive" @click="deleteList">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>

  <Separator class="my-4" />

  <div v-if="!list.milestones?.length > 0"
    class="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
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
      <Button size="sm" class="relative" @click="addMilestone">
        <LucidePlus class="w-4 h-4 mr-2" />
        Add Milestone
      </Button>
    </div>
  </div>

  <div v-else>
    <div class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <MilestoneArtwork v-for="milestone in list.milestones" :key="milestone.id" :milestone="milestone"
        :class="'w-[250px]'" :width="250" :height="330" :aspect-ratio="'portrait'" />

      <router-link :to="{ name: 'milestones' }" class="space-y-3 group" :class="'w-[250px]'" :width="250" :height="330">
        <div
          class="overflow-hidden rounded-md relative border border-dashed border-muted-foreground hover:border-primary transition-colors aspect-[3/4] flex items-center justify-center bg-muted/40">
          <LucidePlus class="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <div class="space-y-1 text-sm text-center">
          <h3 class="font-medium leading-none text-muted-foreground group-hover:text-primary transition-colors">
            Add Milestone
          </h3>
          <p class="text-xs text-muted-foreground">
            Search and add new milestone
          </p>
        </div>
      </router-link>

    </div>
  </div>
</template>
