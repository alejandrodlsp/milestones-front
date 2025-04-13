<script setup>
import { PlusCircledIcon } from '@radix-icons/vue';
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
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
import { computed } from 'vue';
import router from '@/router';
import { useListsStore } from '@/stores/lists';

const listStore = useListsStore()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3),
    description: z.string().max(300).min(5),
  })
)

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((v) => {
  const payload = {
    name: v.name,
    description: v.description,
  }
  listStore.createList(payload).then((response) => {
    console.log(response.data.id)
    router.push({ name: 'list_view', params: { id: response.data.id } });
  })
})

const canSubmit = computed(() => meta.value.valid)
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" class="w-full justify-start">
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        Create List
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create a List</DialogTitle>
        <DialogDescription>
          Create a new list to organize your milestones into categories and goals!
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <div class="grid gap-4 py-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>List Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your new list name" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="submit" :disabled="!canSubmit">
              Create List
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>