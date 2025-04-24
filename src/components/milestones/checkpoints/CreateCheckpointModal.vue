<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

const emit = defineEmits(['close', 'confirmCreate'])

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

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
  emit('close')
  emit('confirmCreate', payload)
})

function closeDialog() {
  emit('close')
}

const canSubmit = computed(() => meta.value.valid)
</script>

<template>
  <Dialog :open="props.open" @update:open="val => { if (!val) emit('close') }">
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
            <Button variant="secondary" @click="closeDialog">Cancel</Button>
          </DialogClose>
          <Button type="submit" :disabled="!canSubmit">
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>