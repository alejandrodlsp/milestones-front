<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'
const emit = defineEmits(['close', 'confirmDelete'])

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

function closeDialog() {
  emit('close')
}

function deleteCheckpoint() {
  emit('confirmDelete')
  emit('close')
}
</script>

<template>
  <Dialog :open="props.open" @update:open="val => { if (!val) emit('close') }">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
      </DialogHeader>
      <p>Are you sure you want to delete this checkpoint?</p>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary" @click="closeDialog">Cancel</Button>
        </DialogClose>
        <Button variant="destructive" @click="deleteCheckpoint">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>