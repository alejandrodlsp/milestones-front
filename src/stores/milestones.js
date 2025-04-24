import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useMilestonesStore = defineStore('milestones', () => {
  const milestones = ref({ milestones: [], meta: { current_page: 1, total_count: 0, total_pages: 1 } })
  const userMilestones = ref([])
  const friendMilestones = ref([])
  const popularMilestones = ref([])
  const recommendedMilestones = ref([])
  const milestone = ref({})

  function loadMilestones({ search = '', category = '', page = 1 }) {
    let promise = securedHttp.get("/api/v1/milestones", {
      params: { search, category, page },
    });
    promise.then(response => {
      milestones.value = response.data;
    })
    promise.catch(error => {
      toast({
        title: 'Failed to fetch milestones',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise
  }

  function loadPopularMilestones() {
    let promise = securedHttp.get("/api/v1/milestones/popular")
    promise.then(response => {
      popularMilestones.value = response.data;
    })
    promise.catch(error => {
      toast({
        title: 'Failed to fetch popular milestones',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function loadUserMilestones() {
    return securedHttp.get("/api/v1/milestones/from_user").then(response => {
      userMilestones.value = response.data.milestones;
    }).catch(error => {
      toast({
        title: 'Failed to fetch user milestones',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function loadFromFriendsMilestones() {
    return securedHttp.get("/api/v1/milestones/from_friends").then(response => {
      friendMilestones.value = response.data.milestones;
    }).catch(error => {
      toast({
        title: 'Failed to fetch friend milestones',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function loadRecommendedMilestones() {
    return securedHttp.get("/api/v1/milestones/recommendations").then(response => {
      recommendedMilestones.value = response.data.milestones;
    }).catch(error => {
      toast({
        title: 'Failed to fetch recommended milestones',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function getMilestone(milestoneId, includes = "user,comments,lists,checkpoints") {
    let promise = securedHttp.get("/api/v1/milestones/" + milestoneId, { params: { includes } })
    promise.then(response => {
      milestone.value = response.data
    }).catch(error => {
      toast({
        title: 'Failed to fetch milestone',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function deleteMilestone(milestoneId) {
    let promise = securedHttp.delete("/api/v1/milestones/" + milestoneId)
    promise.then(() => {
      toast({
        title: 'Milestone deleted successfully',
        variant: "default"
      })
    }).catch(error => {
      toast({
        title: 'Failed to delete milestone',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function createMilestone(formData) {
    let promise = securedHttp.post("/api/v1/milestones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }
    )
    promise.then(response => {
      userMilestones.value.push(response.data);
      toast({
        title: 'Milestone created successfully',
        description: response.data.name,
        variant: "default"
      })
    }).catch(error => {
      toast({
        title: 'Failed to create milestone',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function addComment(milestoneId, commentProps) {
    let promise = securedHttp.post("/api/v1/milestones/" + milestoneId + "/comments", commentProps)
    promise.then(response => {
      milestone.value.comments.push(response.data);
    }).catch(error => {
      toast({
        title: 'Failed to add comment',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function deleteComment(milestoneId, commentId) {
    let promise = securedHttp.delete("/api/v1/milestones/" + milestoneId + "/comments/" + commentId)
    promise.then(() => {
      milestone.value.comments = milestone.value.comments.filter(comment => comment.id !== commentId);
      toast({
        title: 'Comment deleted successfully',
        variant: "default"
      })
    }).catch(error => {
      toast({
        title: 'Failed to delete comment',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function addCheckpoint(milestoneId, checkpointProps) {
    let promise = securedHttp.post(`/api/v1/milestones/${milestoneId}/checkpoints`, checkpointProps)
    promise.then(response => {
      milestone.value.checkpoints.push(response.data);
    }).catch(error => {
      toast({
        title: 'Failed to add checkpoint',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function deleteCheckpoint(milestoneId, checkpointId) {
    let promise = securedHttp.delete(`/api/v1/milestones/${milestoneId}/checkpoints/${checkpointId}`)
    promise.then(() => {
      milestone.value.checkpoints = milestone.value.checkpoints.filter(checkpoint => checkpoint.id !== checkpointId);
    }).catch(error => {
      toast({
        title: 'Failed to delete checkpoint',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function updateCheckpoint(milestoneId, checkpointId, props) {
    let promise = securedHttp.put(`/api/v1/milestones/${milestoneId}/checkpoints/${checkpointId}`, props)
    promise.then(response => {
      const updatedCheckpoint = response.data.checkpoint;
      const index = milestone.value.checkpoints.findIndex(c => c.id === updatedCheckpoint.id);
      if (index !== -1) {
        milestone.value.checkpoints[index] = updatedCheckpoint;
      }
    })
    promise.catch(error => {
      toast({
        title: "Failed to update checkpoint",
        description: error.message,
        variant: "destructive",
      });
    });

    return promise;
  }

  return { userMilestones, friendMilestones, recommendedMilestones, milestone, popularMilestones, milestones, loadUserMilestones, deleteMilestone, loadFromFriendsMilestones, getMilestone, createMilestone, addComment, deleteComment, addCheckpoint, deleteCheckpoint, updateCheckpoint, loadPopularMilestones, loadRecommendedMilestones, loadMilestones }
})
