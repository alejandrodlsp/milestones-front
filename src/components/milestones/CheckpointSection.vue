<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideCheckCircle, LucideCircleDashed, Trash2 } from 'lucide-vue-next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LucidePlus } from 'lucide-vue-next'
import { ref, computed, nextTick, getCurrentInstance } from 'vue';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useMilestonesStore } from '@/stores/milestones'
import { toast } from '@/components/ui/toast'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()
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
  if (!isMilestoneOwner()) return;
  if (checkpointToDelete.value) {
    milestoneStore.deleteCheckpoint(props.milestone.id, checkpointToDelete.value.id);
  }
  isDeleteDialogOpen.value = false;
  checkpointToDelete.value = null;
}

const completingCheckpoint = ref(null); // Tracks the animating checkpoint
const { appContext } = getCurrentInstance()
const confetti = appContext.config.globalProperties.$confetti

const completeCheckpoint = async (checkpoint) => {
  if (!isMilestoneOwner()) return;

  completingCheckpoint.value = checkpoint.id;

  try {
    const completed = checkpoint.completed_at ? false : true;

    await milestoneStore.updateCheckpoint(props.milestone.id, checkpoint.id, { completed })

    if (completed) {
      showConfetti()
      toast({
        title: 'Checkpoint reached! One step closer to the finish line!',
        variant: "success"
      })
    }

    await nextTick();

    completingCheckpoint.value = null;
  } catch {
    completingCheckpoint.value = null;
  }
};
const canSubmit = computed(() => meta.value.valid)

const formattedDate = (date) => {
  return date
    ? new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date))
    : 'No completion date';
};

const confettiAvailable = ref(true)
const showConfetti = () => {
  if (!confettiAvailable.value) return;
  confettiAvailable.value = false
  confetti.start();
  setTimeout(() => { confetti.stop() }, 1000) // Confetti duration
  setTimeout(() => { confettiAvailable.value = true }, 5000) // Confetti cooldown
}

const isMilestoneOwner = computed(() => usersStore.me?.id === props.milestone.user?.id)
</script>

<template>
  <CardHeader class="flex justify-between">
    <div class="flex justify-between space-x-2">
      <CardTitle class="text-lg">🏁 Progress Checkpoints</CardTitle>
      <Button v-if="isMilestoneOwner" @click="isCreateDialogOpen = true" variant="ghost" class="p-2">
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

      <TransitionGroup name="checkpoint">
        <li v-for="checkpoint in props.milestone.checkpoints" :key="checkpoint.id"
          class="flex items-center justify-between transition-all duration-300"
          :class="{ 'opacity-50 scale-90': completingCheckpoint === checkpoint.id }">
          <div class="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="success" @click="completeCheckpoint(checkpoint)" class="group">
                  <LucideCheckCircle v-if="checkpoint.completed_at"
                    class="w-5 h-5 text-green-500 transition-all duration-300 group-hover:text-gray-400" />
                  <LucideCircleDashed v-else
                    class="w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-green-500" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>{{ checkpoint.completed_at ? 'Mark as incomplete' : 'Mark as complete' }}</span>
              </TooltipContent>
            </Tooltip>
            <div>
              <p class="text-sm font-medium" :class="{ 'pb-1': !checkpoint.completed_at }">{{ checkpoint.name }}</p>
              <p v-if="checkpoint.completed_at" class="text-xs text-muted-foreground">
                📆 {{ formattedDate(checkpoint.completed_at) }}
              </p>
            </div>
          </div>
          <Button v-if="isMilestoneOwner" variant="ghost" class="p-2" @click="confirmDelete(checkpoint)">
            <Trash2 class="h-4 w-4 text-muted-foreground hover:text-red-500 transition" />
          </Button>
        </li>
      </TransitionGroup>

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