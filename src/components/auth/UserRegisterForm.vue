<script setup lang="ts">
import { plainHttp } from '@/axios'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

import { cn } from '@/lib/utils'
import { ref, computed } from 'vue'

import { ReloadIcon } from '@radix-icons/vue'

import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import router from '@/router'

const isLoading = ref(false)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(20),
    last_name: z.string().min(2).max(30),
    email: z.string().email().max(50),
    password: z.string().min(8).regex(/\d/, "Password must contain at least one digit"),
    password_confirmation: z.string()
  })
    .superRefine(({ password_confirmation, password }, ctx) => {
      if (password_confirmation !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords do not match",
          path: ['password_confirmation']
        });
      }
    })
)

const { handleSubmit, meta, values } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((v) => {
  const payload = {
    name: v.name,
    last_name: v.last_name,
    email: v.email,
    password: v.password,
    password_confirmation: v.password_confirmation
  }
  plainHttp.post('/signup', payload)
    .then(response => onLoginSuccess(response))
    .catch(error => onLoginFailed(error))
})

const onLoginSuccess = (response) => {
  if (!response.data.csrf) {
    onLoginFailed(response)
    return
  }
  toast({ title: 'Registration successfully.' })

  localStorage.csrf = response.data.csrf
  localStorage.signedIn = true

  router.replace({ path: '/' })
}

const onLoginFailed = (error) => {
  const message = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
  toast({
    title: 'Registration failed:',
    description: message,
  })
  delete localStorage.csrf
  delete localStorage.signedIn
}

const canSubmit = computed(() => {
  return meta.value.valid
})
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="name" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="last_name">
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="last name" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="example@email.com" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>

          <FormField v-if="values.password != null" v-slot="{ componentField }" name="password_confirmation">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage class="text-sm text-right" />
            </FormItem>
          </FormField>
        </div>
        <Button :disabled="isLoading || !canSubmit">
          <ReloadIcon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Continue
        </Button>
      </div>
    </form>
  </div>
</template>