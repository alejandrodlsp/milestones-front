<script setup>
import { RouterView } from "vue-router";
import Toaster from '@/components/ui/toast/Toaster.vue'

import { configure } from 'vee-validate';
// Default values
configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});
</script>

<template>
  <Toaster />
  <RouterView />
</template>

<style scoped></style>
