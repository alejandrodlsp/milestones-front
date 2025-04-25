<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InstagramLogoIcon } from '@radix-icons/vue';
import { FacebookIcon } from 'lucide-vue-next';
import { TwitterIcon } from 'lucide-vue-next';
import { useMilestoneCompletionStore } from '@/stores/milestone_completions';
import { computed } from 'vue';
import { useMilestonesStore } from '@/stores/milestones';

const emit = defineEmits(['update:open', 'confirm'])
const milestoneCompletionStore = useMilestoneCompletionStore()
const milestoneStore = useMilestonesStore()
const API_URL = import.meta.env.VITE_BACKEND_API

const props = defineProps({
  open: Boolean
})

function shareOnTwitter() {
  const text = encodeURIComponent("¡Mira este hito increíble!");
  const url = encodeURIComponent(`${API_URL}/api/v1/milestone-share/${milestoneStore.milestone.id}`)

  const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(shareUrl, "_blank", "width=600,height=400");
}

function shareOnFacebook() {
  const url = encodeURIComponent(`${API_URL}/api/v1/milestone-share/${milestoneStore.milestone.id}`)

  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(shareUrl, "_blank", "width=600,height=400");
}

const milestoneCompletionImage = computed(() => {
  return milestoneCompletionStore.milestone_completion.images_url.length > 0 ? milestoneCompletionStore.milestone_completion.images_url[0] : ""
})

const milestoneCompletionTitle = computed(() => {
  return "I’ve completed something special! " + milestoneStore.milestone.name
})
</script>

<template>
  <!-- Dialog for Social Media Share -->
  <Dialog :open="props.open" @update:open="val => emit('update:open', val)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Share Your Achievement on Social Media</DialogTitle>
        <p class="text-sm text-muted-foreground mt-2">
          Almost done! Here’s a preview of what you’ll be sharing.
        </p>
      </DialogHeader>

      <!-- Preview Section -->
      <div class="mt-4">
        <div class="bg-gray-100 p-4 rounded-md shadow-md">
          <div class="flex space-x-4 mb-4">
            <!-- Image Preview -->
            <img :src="milestoneCompletionImage" alt="Completion Photo" class="w-24 h-24 object-cover rounded-md" />
            <div class="flex-1">
              <p class="font-semibold text-lg">{{ milestoneCompletionTitle }}</p>
              <p class="text-sm text-muted-foreground mt-2">{{ milestoneCompletionStore.milestone_completion.summary }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <Button variant="outline" class="w-full bg-blue-600 text-white hover:bg-blue-700 mt-2"
            @click="shareOnFacebook">
            <FacebookIcon class="mr-2" /> Share to Facebook
          </Button>
          <Button variant="outline" class="w-full bg-blue-400 text-white hover:bg-blue-500 mt-2"
            @click="shareOnTwitter">
            <TwitterIcon class="mr-2" /> Share to X
          </Button>
          <Button variant="outline"
            class="w-full bg-gradient-to-br from-pink-500 to-yellow-500 text-white hover:bg-gradient-to-bl mt-2">
            <InstagramLogoIcon class="mr-2" /> Share to Instagram
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
