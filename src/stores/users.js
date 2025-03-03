import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useUsersStore = defineStore('users', () => {
  const user = ref([])
  const me = ref([])

  function loadUser(id) {
    const promise = securedHttp.get("/api/v1/users/" + id)
    
    promise.catch(error => {
      toast({
        title: 'Failed to fetch user',
        description: error.message,
        variant: "destructive"
      })
    })

    return promise
  }

  function getMe() {
    const promise = securedHttp.get('/api/v1/users/me')
    promise.then(response => {
      me.value = response.data;
    })
    promise.catch(error => {
      toast({
        title: 'Failed to fetch user',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function updateMe(formData) {
    if (!me.value) {
      return toast({
        title: 'User not found',
        description: 'Please log in to update your profile.',
        variant: 'warning'
      });
    }

    const promise = securedHttp.put(`/api/v1/users/${me.value.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    promise.then(response => {
      me.value = response.data;
    })

    promise.catch(error => {
      toast({ 
        title: "Failed to update profile",
        description: error.response?.data?.error,
        variant: "destructive"
      });
    })
    return promise;
  }

  function updatePassword(newPassword, confirmPassword) {
    if (!me.value) {
      return toast({
        title: 'User not found',
        description: 'Please log in to update your password.',
        variant: 'warning'
      });
    }

    const promise = securedHttp.put("/api/v1/users/update_password", {
      password: newPassword,
      password_confirmation: confirmPassword,
    });

    promise.catch(error =>{
      toast({ title: error.response?.data?.error || "Failed to update password", variant: "destructive" });
    })

    return promise;
  }

  return { user, me, loadUser, getMe, updateMe, updatePassword }
})
