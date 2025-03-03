<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideCheckCircle, LucideDot, LucideTrash2 } from 'lucide-vue-next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LucidePlus } from 'lucide-vue-next'
import { ref, computed } from 'vue';
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useMilestonesStore } from '@/stores/milestones'
const milestoneStore = useMilestonesStore()

const props = defineProps({
  milestone: {
    required: true
  }
})

const isCreateDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const checkpointToDelete = ref(null)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2)
  })
)

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((v) => {
  const payload = {
    name: v.name
  }
  milestoneStore.addCheckpoint(props.milestone.id, payload)
})

const confirmDelete = (checkpoint) => {
  checkpointToDelete.value = checkpoint;
  isDeleteDialogOpen.value = true;
}

const deleteCheckpoint = () => {
  if (checkpointToDelete.value) {
    milestoneStore.deleteCheckpoint(props.milestone.id, checkpointToDelete.value.id);
  }
  isDeleteDialogOpen.value = false;
  checkpointToDelete.value = null;
}

const canSubmit = computed(() => meta.value.valid)
</script>

<template>
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
      <div v-if="!props.milestone.checkpoints || props.milestone.checkpoints.length === 0"
        class="flex justify-center items-center h-full text-muted-foreground text-sm">
        No checkpoints yet. Create checkpoints to keep track of your progress!
      </div>

      <li v-else v-for="checkpoint in props.milestone.checkpoints" :key="checkpoint.id"
        class="flex items-center space-x-3 justify-between">
        <div class="flex items-center space-x-3">
          <Badge variant="success">
            <LucideCheckCircle v-if="checkpoint.completed_at" class="w-5 h-5 text-green-500" />
            <LucideDot v-else class="w-5 h-5 text-gray-400" />
          </Badge>
          <div>
            <p class="text-sm font-medium">{{ checkpoint.name }}</p>
            <p v-if="checkpoint.completed_at" class="text-xs text-muted-foreground">
              📆 {{ checkpoint.completed_at }}
            </p>
          </div>
        </div>
        <Button variant="ghost" class="p-2" @click="confirmDelete(checkpoint)">
          <LucideTrash2 class="w-5 h-5 text-red-500" />
        </Button>
      </li>
    </ul>
  </CardContent>

  <Dialog v-model:open="isCreateDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Progress Checkpoint</DialogTitle>
      </DialogHeader>

      <form @submit="onSubmit">
        <div class="grid gap-4 py-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Name your progress checkpoint" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="submit" :disabled="!canSubmit">
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="isDeleteDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
      </DialogHeader>
      <p>Are you sure you want to delete this checkpoint?</p>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button variant="destructive" @click="deleteCheckpoint">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>