<script setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/toast'
import router from '@/router'
import { ref } from 'vue';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import {
  CreditCard,
  LogOut,
  Settings,
  User,
} from 'lucide-vue-next'
import { securedHttp } from '@/axios';
import { useUsersStore } from '@/stores/users';

const userStore = useUsersStore()

const loading = ref(true)
userStore.getMe().then(() => loading.value = false)

const logout = () => {
  securedHttp.delete('/signin')
    .then(() => {
      toast({
        title: 'Signed out'
      })

      delete localStorage.csrf
      delete localStorage.signedIn

      router.replace({ name: 'login' })
    })
    .catch((e) => {
      toast({
        title: 'Failed to log out',
        variant: "destructive"
      })
      console.error(e)
    })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Card class="cursor-pointer">
        <CardContent class="flex items-center space-x-4 pt-5">
          <template v-if="!loading">
            <Avatar>
              <AvatarImage :src="userStore.me.avatar" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium leading-none">
                {{ userStore.me.first_name }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ userStore.me.email }}
              </p>
            </div>
          </template>

          <template v-else>
            <Skeleton class="h-12 w-12 rounded-full" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-[150px]" />
              <Skeleton class="h-4 w-[100px]" />
            </div>
          </template>
        </CardContent>
      </Card>

    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <router-link :to="{ name: 'profile_view' }">
          <DropdownMenuItem>
            <User class="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </router-link>
        <DropdownMenuItem>
          <CreditCard class="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings class="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout" class="text-red-600">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>