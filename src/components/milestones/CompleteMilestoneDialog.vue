<script setup>
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { XCircleIcon } from 'lucide-vue-next'

import { useMilestoneCompletionStore } from '@/stores/milestone_completions'

const props = defineProps({
  open: Boolean,
  milestone_id: {
    type: Number,
    required: true
  }
})

const milestoneCompletionStore = useMilestoneCompletionStore()
const emit = defineEmits(['update:open', 'confirm'])

const summary = ref('')
const files = ref([])
const filePreviews = ref([])  // To hold base64 previews of the images

// Handle file change and read each file as a data URL
function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files).filter(file => file instanceof File)

  // Append new files to the existing ones
  selectedFiles.forEach(file => {
    files.value.push(file)
    const reader = new FileReader()
    reader.onload = () => {
      filePreviews.value.push(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

// Remove file and its preview
function removeFile(index) {
  files.value.splice(index, 1)
  filePreviews.value.splice(index, 1)
}

function confirmCompletion() {
  const formData = new FormData();
  formData.append("milestone_id", props.milestone_id);
  formData.append("summary", summary.value);
  files.value.forEach((file) => {
    formData.append("images[]", file);
  });

  milestoneCompletionStore.createMilestoneCompletion(formData).then(() => {
    emit('completed', {
      summary: summary.value,
      files: files.value,
    })
  }).finally(() => {
    emit('update:open', false)
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold text-gray-800 dark:text-white">
          Finish Your Milestone
        </DialogTitle>
        <p class="text-sm text-muted-foreground mt-2">
          Once completed, this milestone cannot be undone. Are you sure you want to mark it as complete?
        </p>
      </DialogHeader>

      <div class="space-y-6 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white">
            Upload Photos of Your Completion
          </label>
          <input type="file" multiple
            class="mt-2 block w-full text-sm text-gray-500 file:bg-gray-100 file:px-3 file:py-1.5 file:border file:rounded file:cursor-pointer"
            @change="handleFileChange" />
        </div>

        <!-- Display uploaded photos -->
        <div v-if="filePreviews.length > 0" class="grid grid-cols-3 gap-4 mt-4">
          <div v-for="(preview, index) in filePreviews" :key="index"
            class="w-full h-24 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
            <!-- Remove Button -->
            <button @click="removeFile(index)" class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
              <XCircleIcon class="transition-transform duration-200 transform hover:scale-125" />
            </button>
            <img :src="preview" alt="Uploaded Image" class="object-cover w-full h-full" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white">
            Final Summary or Reflection
          </label>
          <Textarea v-model="summary" rows="4" placeholder="Share your thoughts on completing this milestone..." />
        </div>
      </div>

      <DialogFooter class="mt-6 space-x-4">
        <Button variant="outline" @click="emit('update:open', false)">Cancel</Button>
        <Button variant="default" @click="confirmCompletion">Confirm and Complete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
