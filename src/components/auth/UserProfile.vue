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

import {
  CreditCard,
  LogOut,
  Settings,
  User,
} from 'lucide-vue-next'
import { securedHttp } from '@/axios';

const userData = ref({
  name: '',
  last_name: '',
  email: '',
  created_at: '',
})
securedHttp.get('/me').then((response) => {
  userData.value = response["data"]
})

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
          <Avatar>
            <AvatarImage
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/599e3b95636919.5eb96c0445ea7.jpg" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium leading-none">
              {{ userData.name }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ userData.email }}
            </p>
          </div>
        </CardContent>
      </Card>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <User class="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
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