<script setup>
import { TooltipProvider } from '@/components/ui/tooltip'
import Sidebar from '@/components/SideBar.vue'
import BreadcrumbBar from '@/components/BreadcrumbBar.vue';
import UserProfile from '@/components/auth/UserProfile.vue';
import ColorMode from '@/components/ColorMode.vue';
</script>

<template>
  <div class="hidden md:block w-full">
    <TooltipProvider>
      <div class="border-t">
        <div class="bg-background">
          <div class="grid lg:grid-cols-7">
            <div class="fixed top-4 right-4 z-50">
              <ColorMode />
            </div>

            <Sidebar class="hidden lg:block" />

            <div class="h-full flex-col border-none col-span-6 p-10 data-[state=active]:flex">
              <BreadcrumbBar />
              <router-view />
            </div>

            <div class="fixed bottom-4 left-4 z-50">
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  </div>
</template>