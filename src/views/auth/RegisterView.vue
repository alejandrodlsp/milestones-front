<script setup>
import UserRegisterForm from '@/components/auth/UserRegisterForm.vue';
import { LogInIcon } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

</script>
<template>
  <router-link to="/auth" variant="link" :class="cn(
    'absolute right-4 top-4 md:right-8 md:top-8 flex',
  )">
    <LogInIcon />
    <span class="ms-1">LogIn</span>
  </router-link>
  <div class="lg:p-8">
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          Register a new account
        </h1>
        <p class="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <!-- Router View for Login/Register -->
      <UserRegisterForm />

      <p class="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our
        <a href="/terms" class="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>
        and
        <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  </div>
</template>