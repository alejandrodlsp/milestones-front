<script setup>
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ref } from "vue";
import { toast } from '@/components/ui/toast'
import { useUsersStore } from "@/stores/users";

const userStore = useUsersStore()

// Profile State
const id = ref(null);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const avatar = ref(null);
const avatarPreview = ref("https://via.placeholder.com/128");

// Password Change State
const newPassword = ref("");
const confirmPassword = ref("");

userStore.getMe().then(response => {
  const data = response["data"]
  firstName.value = data["first_name"]
  lastName.value = data["last_name"]
  email.value = data["email"]
  avatarPreview.value = data["avatar"]
  id.value = data["id"];
})

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatar.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const updateProfile = async () => {
  const formData = new FormData();
  formData.append("user[name]", firstName.value);
  formData.append("user[last_name]", lastName.value);
  if (avatar.value) {
    formData.append("user[image]", avatar.value);
  }
  userStore.updateMe(formData).then(() => {
    toast({ title: "Profile updated successfully", variant: "success" });
  })
};


const updatePassword = async () => {
  if (!newPassword.value || newPassword.value !== confirmPassword.value) {
    toast({ title: "Passwords do not match", variant: "destructive" });
    return;
  }

  userStore.updatePassword(newPassword.value, confirmPassword.value).then(() => {
    newPassword.value = "";
    confirmPassword.value = "";
    toast({ title: "Password updated successfully", variant: "success" });
  })
};
</script>

<template>
  <div class="max-w-5xl mx-auto flex gap-6 py-6 px-4">
    <!-- Form Section -->
    <div class="w-full lg:w-2/3 space-y-6">
      <Card class="p-6">
        <CardHeader>
          <CardTitle class="text-xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-col items-center space-y-4">
            <Avatar class="w-32 h-32">
              <AvatarImage :src="avatarPreview" />
              <AvatarFallback>{{ firstName[0] }}</AvatarFallback>
            </Avatar>
            <Input type="file" @change="handleAvatarChange" accept="image/*" class="w-full" />
          </div>

          <div class="space-y-4 mt-6">
            <div>
              <Label>Email</Label>
              <Input v-model="email" disabled class="opacity-50 cursor-not-allowed" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input v-model="firstName" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input v-model="lastName" />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button @click="updateProfile">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Change Password Section -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle class="text-xl font-semibold">Change Password</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input v-model="newPassword" type="password" placeholder="Enter new password" />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input v-model="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <Button @click="updatePassword">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
