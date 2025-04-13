<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { defineProps, defineModel } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select'
  }
});

const modelValue = defineModel(); // Enables v-model binding

// A helper function to check if the modelValue is null
const getSelectedLabel = () => {
  if (modelValue.value === null) {
    return props.placeholder;
  }
  const selectedOption = props.options.find(o => o.id === modelValue.value);
  return selectedOption ? selectedOption.name : props.placeholder;
}
</script>

<template>
  <Select v-model="modelValue">
    <SelectTrigger class="w-[280px]">
      <SelectValue :placeholder="getSelectedLabel()" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <!-- Add "Clear selection" as the first option -->
        <SelectItem v-if="modelValue !== null" :value="null" class="text-red-500">
          None
        </SelectItem>

        <!-- Iterate over the actual options -->
        <SelectItem v-for="option in props.options" :key="option.id" :value="option.id">
          {{ option.name }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
