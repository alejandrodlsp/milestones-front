<script setup>
import { Separator } from "@/components/ui/separator";
import { useFriendStore } from "@/stores/friends";
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import UserBadge from "@/components/UserBadge.vue";
import Input from '@/components/ui/input/Input.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigationStore } from "@/stores/navigation";
import { ref } from "vue";
const navigationStore = useNavigationStore();
navigationStore.setCurrentTab(`friends`);

const friendStore = useFriendStore();
friendStore.loadFriends()
friendStore.loadPendingRequests()
friendStore.loadSentRequests()

const searchQuery = ref("")
</script>

<template>
  <div class="col-span-3 lg:col-span-4">
    <div class="h-full px-4 py-6 lg:px-8">
      <Tabs default-value="friends" class="h-full space-y-6">
        <div class="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="friends" class="relative">
              My Friends
            </TabsTrigger>
            <TabsTrigger value="search" class="relative">
              Find Friends
              <span v-if="friendStore.pendingRequests.length > 0"
                class="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold h-5 w-5 shadow">
                {{ friendStore.pendingRequests.length }}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="friends" class="border-none p-0 outline-none">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">
                My friends
              </h2>
            </div>
          </div>
          <Card class="mt-5">
            <CardContent class="pt-6">
              <div v-if="friendStore.friends.length < 1">
                🌟 No friends just yet — but new connections are just around the corner!
              </div>
              <div v-else v-for="friend in friendStore.friends" :key="friend.id" class="flex flex-col mt-3">
                <UserBadge :user="friend" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" class="border-none p-0 outline-none">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-2xl font-semibold tracking-tight">
                Find Friends
              </h2>
            </div>

            <div class="space-x-4 flex">
              <Input v-model="searchQuery" type="text" placeholder="Search by name" class="input input-bordered" />
              <Button @click="search">Search</Button>
            </div>
          </div>

          <!-- Main layout split into left and right -->
          <div class="flex mt-5 gap-5">
            <!-- LEFT COLUMN (30%) -->
            <div class="w-[80%] flex flex-col gap-5">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div v-if="friendStore.recommended.length + friendStore.possible.length < 1">
                    No friend recommendations at this time, come back later!
                  </div>
                  <div v-else>
                    <div v-for="friend in friendStore.recommended" :key="friend.id" class="mt-3 flex flex-col">
                      <UserBadge :user="friend" />
                    </div>

                    <div v-for="friend in friendStore.possible" :key="friend.id" class="mt-3 flex flex-col">
                      <UserBadge :user="friend" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div class="w-[20%] flex flex-col gap-5">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div v-if="friendStore.pendingRequests.length < 1">
                    No pending requests
                  </div>
                  <div v-else v-for="friend in friendStore.pendingRequests" :key="friend.id" class="flex flex-col mt-3">
                    <UserBadge :user="friend" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <span v-if="friendStore.sentRequests.length < 1">
                    No friend requests sent
                  </span>
                  <div v-else v-for="friend in friendStore.sentRequests" :key="friend.id" class="flex flex-col mt-3">
                    <UserBadge :user="friend" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
