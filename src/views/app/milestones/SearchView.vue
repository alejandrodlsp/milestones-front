<script setup>
import { ref } from 'vue';
import MilestoneArtwork from '@/components/milestones/MilestoneArtwork.vue';
import { useMilestonesStore } from '@/stores/milestones';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import CustomSelect from '@/components/shared/CustomSelect.vue';
import { useCategoriesStore } from '@/stores/categories';

const searchQuery = ref('');
const categoryQuery = ref('');
const currentPage = ref(1);

const milestoneStore = useMilestonesStore();
const categoryStore = useCategoriesStore();

categoryStore.loadCategories()

const loadMilestones = async () => {
  await milestoneStore.loadMilestones({
    search: searchQuery.value,
    category: categoryQuery.value,
    page: currentPage.value
  });
};
loadMilestones();

const changePage = (page) => {
  currentPage.value = page;
  loadMilestones();
};

const search = () => {
  currentPage.value = 1;
  loadMilestones();
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold tracking-tight">Search</h2>
        <p class="text-sm text-muted-foreground">Discover new milestones.</p>
      </div>

      <!-- Search Inputs -->
      <div class="space-x-4 flex">
        <Input v-model="searchQuery" type="text" placeholder="Search by name" class="input input-bordered" />
        <CustomSelect v-model="categoryQuery" :options="categoryStore.categories" placeholder="Search by category" />
        <Button @click="search">Search</Button>
      </div>
    </div>

    <!-- Milestones Grid -->
    <div class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <MilestoneArtwork v-for="milestone in milestoneStore.milestones.milestones" :key="milestone.id"
        :milestone="milestone" :class="'w-[250px]'" :width="250" :height="330" :aspect-ratio="'portrait'" />
    </div>

    <!-- Pagination -->
    <div class="mt-10 flex justify-center">
      <Pagination @change="changePage" :current="milestoneStore.milestones.meta.current_page"
        :total="milestoneStore.milestones.meta.total_pages" :sibling-count="1" show-edges :default-page="1"
        class="text-center">
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst v-if="milestoneStore.milestones.meta.current_page > 1" @click="changePage(0)" />
          <PaginationPrev v-if="milestoneStore.milestones.meta.current_page > 1"
            @click="changePage(milestoneStore.milestones.meta.current_page - 1)" />

          <template v-for="(item, index) in items" :key="index">
            <PaginationListItem v-if="item.type === 'page'" :value="item.value">
              <Button :variant="item.value === milestoneStore.milestones.meta.current_page ? 'default' : 'outline'"
                class="w-10 h-10 p-0" @click="changePage(item.value)">
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else />
          </template>

          <PaginationNext
            v-if="milestoneStore.milestones.meta.current_page < milestoneStore.milestones.meta.total_pages"
            @click="changePage(milestoneStore.milestones.meta.current_page + 1)" />
          <PaginationLast
            v-if="milestoneStore.milestones.meta.current_page < milestoneStore.milestones.meta.total_pages"
            @click="changePage(milestoneStore.milestones.meta.total_pages)" />
        </PaginationList>
      </Pagination>
    </div>
  </div>
</template>
