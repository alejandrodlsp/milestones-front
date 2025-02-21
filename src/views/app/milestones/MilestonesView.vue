<script setup>
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { PlusCircledIcon } from '@radix-icons/vue'
import RecommendedView from './RecommendedView.vue';
import FromFriendsView from './FromFriendsView.vue';
import SearchView from './SearchView.vue';
import { useNavigationStore } from '@/stores/navigation';

const navigationStore = useNavigationStore()
navigationStore.setCurrentTab("milestones")
</script>

<template>
  <div class="col-span-3 lg:col-span-4 lg:border-l">
    <div class="h-full px-4 py-6 lg:px-8">
      <Tabs default-value="recommended" class="h-full space-y-6">
        <div class="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="recommended" class="relative">
              Recommended
            </TabsTrigger>
            <TabsTrigger value="from_friends">
              From Friends
            </TabsTrigger>
            <TabsTrigger value="search">
              Search
            </TabsTrigger>
          </TabsList>
          <div class="ml-auto mr-4">
            <router-link :to="{ name: 'create_milestone' }">
              <Button>
                <PlusCircledIcon class="mr-2 h-4 w-4" />
                Create your Milestone
              </Button>
            </router-link>
          </div>
        </div>
        <TabsContent value="recommended" class="border-none p-0 outline-none">
          <RecommendedView />
        </TabsContent>

        <TabsContent value="from_friends" class="border-none p-0 outline-none">
          <FromFriendsView />
        </TabsContent>

        <TabsContent value="search" class="h-full flex-col border-none p-0 data-[state=active]:flex">
          <SearchView />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>