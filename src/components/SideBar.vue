<script setup>
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import CreateListButton from './lists/CreateListButton.vue';
import { useListsStore } from '@/stores/lists';
import { useNavigationStore } from '@/stores/navigation';
import { RouterLink } from 'vue-router';
import { useMilestonesStore } from '@/stores/milestones';
import { FolderHeart, FolderOpenDot, HandshakeIcon, MilestoneIcon, Rows3Icon } from 'lucide-vue-next';


const milestoneStore = useMilestonesStore()
milestoneStore.loadUserMilestones();

const listStore = useListsStore()
listStore.loadLists();

const navigationStore = useNavigationStore()
function isSelected(name) {
  return navigationStore.currentTab === name;
}

function sidebarVariant(name) {
  return isSelected(name) ? 'secondary' : 'ghost';
}
</script>

<template>
  <div class="flex justify-between h-screen">
    <div :class="cn('pb-12', $attrs.class ?? '')">
      <div class="space-y-4 py-4">
        <div class="px-3 py-2">
          <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div class="space-y-1">
            <RouterLink :to="{ name: 'milestones' }">
              <Button :variant="sidebarVariant('milestones')" class="w-full justify-start">
                <MilestoneIcon />
                Milestones
              </Button>
            </RouterLink>
            <RouterLink :to="{ name: 'friends' }">
              <Button :variant="sidebarVariant('friends')" class="w-full justify-start">
                <HandshakeIcon />
                Friends
              </Button>
            </RouterLink>
            <Button :variant="sidebarVariant('lists')" class="w-full justify-start">
              <Rows3Icon />
              Lists
            </Button>
          </div>
        </div>
        <div class="px-3 py-2">
          <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
            My Lists
          </h2>
          <div class="space-y-1">
            <RouterLink v-for="list in listStore.lists" :key="list.id" :to="{ path: '/list/' + list.id }">
              <Button :variant="sidebarVariant(`list-${list.id}`)" class="w-full justify-start"
                :class="{ 'font-bold': isSelected(`list-${list.id}`) }">
                <FolderOpenDot v-if="isSelected(`list-${list.id}`)" />
                <FolderHeart v-else />
                {{ list.name }}
              </Button>
            </RouterLink>
            <CreateListButton />
          </div>
        </div>
        <div class="py-2">
          <h2 class="relative px-7 text-lg font-semibold tracking-tight">
            Recent Milestones
          </h2>
          <ScrollArea class="h-[300px] px-1">
            <div class="space-y-1 p-2">
              <RouterLink v-for="(milestone, i) in milestoneStore.userMilestones" :key="`${milestone.name}-${i}`"
                :to="{ path: '/milestone/' + milestone.id }">
                <Button :variant="sidebarVariant(`milestone-${milestone.id}`)" class="w-full justify-start font-normal"
                  :class="{ 'font-bold': isSelected(`milestone-${milestone.id}`) }">
                  <MilestoneIcon />
                  {{ milestone.name }}
                </Button>
              </RouterLink>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  </div>
</template>