<script setup>
import { FolderHeartIcon } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card'
import { defineProps } from 'vue';

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="space-y-6">
    <Card v-if="props.milestone?.lists?.length">
      <CardContent>
        <!-- If milestone is in lists, show them -->
        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">This milestone is in your lists:</h3>
          <div class="space-y-1">
            <router-link :to="{ path: '/list/' + list.id }" v-for="list in props.milestone?.lists" :key="list.id"
              class="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <FolderHeartIcon />
              <span class="font-medium">{{ list.name }}</span>
            </router-link>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>