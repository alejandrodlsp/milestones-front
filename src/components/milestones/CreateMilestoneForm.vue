<script setup>
import { ref, computed, watch } from 'vue';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox/index.js';
import { useCategoriesStore } from '@/stores/categories';
import { useListsStore } from '@/stores/lists';
import CustomCombobox from '../shared/CustomCombobox.vue';
import { useMilestonesStore } from '@/stores/milestones';
import { useNavigationStore } from '@/stores/navigation';
import router from '@/router'
import { LucidePlus } from 'lucide-vue-next'
import CreateCheckpointModal from './checkpoints/CreateCheckpointModal.vue';
import DeleteCheckpointModal from './checkpoints/DeleteCheckpointModal.vue';
import { Trash2, MilestoneIcon } from 'lucide-vue-next'

const navigationStore = useNavigationStore();
const categoriesStore = useCategoriesStore();
const listsStore = useListsStore();
const milestoneStore = useMilestonesStore();

// Load store data
categoriesStore.loadCategories();
listsStore.loadLists();
navigationStore.setCurrentTab("milestones")

// Validation
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'Milestone name must be at least 3 characters.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    dueDate: z.string().refine((date) => new Date(date) > new Date(), {
      message: 'Due date must be in the future.',
    }),
  })
);

function validateCategories() {
  if (selectedCategories.value.length < 1) {
    categoryError.value = "Must select at least one category"
    return false;
  } else {
    categoryError.value = null
    return true;
  }
}

function validateImages() {
  if (!imageFile.value) {
    imageError.value = "Must provide an image"
    return false;
  } else {
    return true;
  }
}

// Form Setup
const { handleSubmit } = useForm({ validationSchema: formSchema });
const name = useField('name');
const description = useField('description');
const dueDate = useField('dueDate');
const selectedCategories = ref([]);
const selectedLists = ref([]);
const categoryError = ref()
const imageError = ref()

// Image Upload
const imageFile = ref(null);
const imagePreview = ref(null);
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.value = e.target.result);
    reader.readAsDataURL(file);
    imageError.value = null;
  }
};

// Form submission
const onSubmit = handleSubmit((values) => {
  if (!validateCategories()) return;
  if (!validateImages()) return;

  const formData = new FormData();
  formData.append("milestone[name]", values.name);
  formData.append("milestone[description]", values.description);
  formData.append("milestone[due_date]", values.dueDate);
  formData.append("milestone[image]", imageFile.value);
  formData.append("milestone[private]", true);
  selectedCategories.value.forEach((categoryId) => {
    formData.append(`milestone[category_ids][]`, categoryId);
  });

  selectedLists.value.forEach((listId) => {
    formData.append(`milestone[list_ids][]`, listId);
  });

  checkpoints.value.forEach((checkpoint) => {
    formData.append(`milestone[checkpoints_attributes][]`, checkpoint);
  });

  milestoneStore.createMilestone(formData).then((response) => {
    router.push({ name: 'milestone_view', params: { id: response.data.id } });
  });
});

const toggleListSelection = (listId) => {
  if (selectedLists.value.includes(listId)) {
    selectedLists.value = selectedLists.value.filter(id => id !== listId);
  } else {
    selectedLists.value.push(listId);
  }
};

const checkpoints = ref([])
const isCreateDialogOpen = ref(false)
const createMilestoneCheckpoint = (payload) => {
  checkpoints.value.push(payload)
}

const checkpointToDelete = ref(null)
const isDeleteDialogOpen = ref(false)
const deleteMilestoneCheckpoint = (index) => {
  checkpoints.value.splice(index, 1)
}

const confirmDelete = (index) => {
  checkpointToDelete.value = index
  isDeleteDialogOpen.value = true
}

watch(() => selectedCategories.value, () => {
  validateCategories();
}, { deep: true })

const categoriesValues = computed(() => { return categoriesStore.categories.map(c => ({ "value": c.id, "label": c.name })) })
</script>

<template>
  <div class="max-w-5xl mx-auto flex gap-6 py-6 px-4">
    <!-- Form Section -->
    <div class="w-full lg:w-2/3 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-xl font-semibold">Create Milestone</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Name -->
          <div>
            <Input v-model="name.value" placeholder="Milestone Name" required />
            <p v-if="name.errorMessage" class="text-red-500 text-sm">{{ name.errorMessage }}</p>
          </div>

          <!-- Image Upload -->
          <div>
            <Label class="text-sm font-medium">Upload an Image</Label>
            <Input type="file" accept="image/*" @change="handleImageUpload" />
            <img v-if="imagePreview" :src="imagePreview" class="rounded-lg w-full max-h-60 object-cover mt-2" />
            <p v-if="imageError" class="text-red-500 text-sm">{{ imageError }}</p>
          </div>

          <!-- Description -->
          <div>
            <Textarea v-model="description.value" placeholder="Describe your milestone..." required />
            <p v-if="description.errorMessage" class="text-red-500 text-sm">{{ description.errorMessage }}</p>
          </div>

          <!-- Due Date -->
          <div>
            <Label class="text-sm font-medium">Complete by</Label>
            <Input v-model="dueDate.value" type="date" required />
            <p v-if="dueDate.errorMessage" class="text-red-500 text-sm">{{ dueDate.errorMessage }}</p>
          </div>

          <!-- Categories Multi-Select -->
          <div>
            <Label class="text-sm font-medium">Categories</Label>
            <div class="">
              <CustomCombobox v-model="selectedCategories" placeholder="Select a category"
                :options="categoriesValues" />
              <p v-if="categoryError" class="text-red-500 text-sm">{{ categoryError }}</p>
            </div>
          </div>

          <!-- Lists Multi-Select -->
          <div>
            <Label class="text-sm font-medium">Add to Lists</Label>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="list in listsStore.lists" :key="list.id" class="flex items-center space-x-2">
                <Checkbox :checked="selectedLists.includes(list.id)" @update:checked="toggleListSelection(list.id)" />
                <span>{{ list.name }}</span>
              </div>
            </div>
          </div>

          <Separator />
          <Button @click="onSubmit" class="w-full">Create Milestone</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex justify-between">
          <div class="flex justify-between space-x-2">
            <CardTitle class="text-lg">🏁 Progress Checkpoints</CardTitle>
            <Button @click="isCreateDialogOpen = true" variant="ghost" class="p-2">
              <LucidePlus class="w-5 h-5 text-blue-500" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ul class="space-y-3">
            <div v-if="checkpoints.length === 0"
              class="flex justify-center items-center h-full text-muted-foreground text-sm">
              No checkpoints yet. Create checkpoints to keep track of your progress!
            </div>

            <TransitionGroup name="checkpoint">
              <li v-for="(checkpoint, i) in checkpoints" :key="checkpoint.id" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <MilestoneIcon />
                  <p class="text-sm font-medium">{{ checkpoint.name }}
                  </p>
                </div>
                <Button variant="ghost" class="p-2" @click="confirmDelete(i)">
                  <Trash2 class="h-4 w-4 text-muted-foreground hover:text-red-500 transition" />
                </Button>
              </li>
            </TransitionGroup>

          </ul>
        </CardContent>
      </Card>
    </div>
  </div>

  <CreateCheckpointModal :open="isCreateDialogOpen" @close="isCreateDialogOpen = false"
    @confirmCreate="createMilestoneCheckpoint" />
  <DeleteCheckpointModal :open="isDeleteDialogOpen" @close="isDeleteDialogOpen = false"
    @confirmDelete="deleteMilestoneCheckpoint" />
</template>

<style>
.dark img {
  filter: brightness(0.8);
}
</style>