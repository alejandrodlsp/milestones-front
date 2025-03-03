<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-vue-next'
import UserBadge from '@/components/UserBadge.vue'
import { useMilestonesStore } from '@/stores/milestones'
import { useUsersStore } from '@/stores/users'

const props = defineProps({
  milestone: {
    required: true
  }
})

const milestoneStore = useMilestonesStore()
const userStore = useUsersStore()
const newComment = ref("")
const commentToDelete = ref(null) // Track which comment is being deleted
const isConfirmDialogOpen = ref(false)

const addComment = () => {
  if (!newComment.value.trim()) return
  milestoneStore.addComment(props.milestone.id, { comment: { message: newComment.value } })
  newComment.value = ""
}

const isMilestoneOwner = computed(() => userStore.me?.id === props.milestone.user?.id)

// Open confirmation dialog
const confirmDelete = (commentId) => {
  commentToDelete.value = commentId
  isConfirmDialogOpen.value = true
}

// Delete comment after confirmation
const deleteComment = () => {
  if (commentToDelete.value) {
    milestoneStore.deleteComment(props.milestone.id, commentToDelete.value)
  }
  isConfirmDialogOpen.value = false
  commentToDelete.value = null
}

// Utility function to format the date
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
  })
}
</script>

<template>
  <ScrollArea class="h-52 overflow-y-auto">
    <div v-if="!props.milestone.comments || props.milestone.comments.length === 0"
      class="flex justify-center items-center h-full text-muted-foreground text-sm">
      No comments yet. Be the first to share your thoughts!
    </div>

    <div v-else>
      <div v-for="(comment, index) in props.milestone.comments" :key="index"
        class="flex items-start justify-between space-x-3 mb-4 w-full">

        <div class="flex items-start space-x-3">
          <UserBadge :user="comment.user">
            <span class="text-xs text-muted-foreground">{{ formatDate(comment.created_at) }}</span>
            <p class="text-l">{{ comment.message }}</p>
            <!-- Date displayed below the name -->
          </UserBadge>
        </div>

        <!-- Delete button always aligned to the right -->
        <div class="flex justify-end min-w-[40px]">
          <Button v-if="isMilestoneOwner" @click="confirmDelete(comment.id)" variant="ghost" size="icon">
            <Trash2 class="h-4 w-4 text-muted-foreground hover:text-red-500 transition" />
          </Button>
        </div>
      </div>
    </div>
  </ScrollArea>

  <Separator class="my-4" />

  <div class="space-y-2">
    <Textarea v-model="newComment" placeholder="📝 Write a comment..." class="w-full" />
    <Button @click="addComment" class="w-full">🚀 Post Comment</Button>
  </div>

  <Dialog v-model:open="isConfirmDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
      </DialogHeader>
      <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
      <DialogFooter class="flex justify-end gap-2">
        <Button variant="outline" @click="isConfirmDialogOpen = false">Cancel</Button>
        <Button variant="destructive" @click="deleteComment">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
