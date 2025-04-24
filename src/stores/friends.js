import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useFriendStore = defineStore('friends', () => {
  const possible = ref([])
  const recommended = ref([])
  const friends = ref([])
  const pendingRequests = ref([])
  const sentRequests = ref([])
  const friendshipStatus = ref("same_user")
  const friendship = ref(null)

  function loadFriends() {
    return securedHttp.get("/api/v1/friendships").then(response => {
      friends.value = response.data.friends
      possible.value = response.data.possible_friends
      recommended.value.data = response.data.recommended_from_friends
    }).catch(error => {
      toast({
        title: 'Failed to load friends',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function loadFriendshipStatus(friendId) {
    return securedHttp.get("/api/v1/friendships/" + friendId).then(response => {
      friendshipStatus.value = response.data.status
      friendship.value = response.data.friendship
    }).catch (error => {
        toast({
          title: 'Failed to get friendship status',
          description: error.message,
          variant: "destructive"
        })
      })
  }

  function loadPendingRequests() {
    return securedHttp.get("/api/v1/friendships/pending").then(response => {
      pendingRequests.value = response.data.users
    }).catch(error => {
      toast({
        title: 'Failed to load pending requests',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function loadSentRequests() {
    return securedHttp.get("/api/v1/friendships/sent").then(response => {
      sentRequests.value = response.data.users
    }).catch(error => {
      toast({
        title: 'Failed to load sent requests',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function sendFriendRequest(friendId) {
    return securedHttp.post("/api/v1/friendships", { friend_id: friendId }).then(response => {
      toast({
        title: 'Friend request sent',
        variant: "default"
      })
      sentRequests.value.push(response.data.user)
      possible.value = possible.value.filter(f => f.id !== friendId)
      recommended.value = recommended.value.filter(f => f.id !== friendId)
    }).catch(error => {
      toast({
        title: 'Failed to send friend request',
        description: error.response?.data?.error || error.message,
        variant: "destructive"
      })
    })
  }

  function acceptFriendRequest(friendId) {
    return securedHttp.put(`/api/v1/friendships/${friendId}`).then((response) => {
      toast({
        title: 'Friend request accepted',
        variant: "default"
      })
      pendingRequests.value = pendingRequests.value.filter(f => f.id !== friendId)
      this.loadFriends()
    }).catch(error => {
      toast({
        title: 'Failed to accept request',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function removeFriend(friendId) {
    return securedHttp.delete(`/api/v1/friendships/${friendId}`).then(() => {
      toast({
        title: 'Friend removed',
        variant: "default"
      })  
      this.loadFriends()
    }).catch(error => {
      toast({
        title: 'Failed to remove friend',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  return {
    possible,
    recommended,
    friends,
    pendingRequests,
    sentRequests,
    friendshipStatus,
    friendship,
    loadFriends,
    loadFriendshipStatus,
    loadPendingRequests,
    loadSentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend
  }
})
