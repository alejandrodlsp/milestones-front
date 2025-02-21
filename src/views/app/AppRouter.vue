<script setup>
import Sidebar from '@/components/SideBar.vue'

import { yourMilestones } from './example/data/milestones.js'
import ColorMode from '@/components/ColorMode.vue';

</script>

<template>
  <div class="md:hidden">
    <VPImage alt="Music" width="1280" height="1214" class="block" :image="{
      dark: '/examples/music-dark.png',
      light: '/examples/music-light.png',
    }" />
  </div>
  <div class="hidden md:block w-full">
    <div class="border-t">
      <div class="bg-background">
        <div class="grid lg:grid-cols-7">
          <div class="fixed top-4 right-4 z-50">
            <ColorMode />
          </div>

          <Sidebar :milestones="yourMilestones" class="hidden lg:block" />

          <div class="h-full flex-col border-none col-span-6 p-10 data-[state=active]:flex">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>