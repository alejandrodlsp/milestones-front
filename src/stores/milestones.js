import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useMilestonesStore = defineStore('milestones', () => {
  const userMilestones = ref([])
  const milestone = ref({})

  function loadUserMilestones() {
    return securedHttp.get("/api/v1/milestones/user_milestones").then(response => {
      userMilestones.value = response.data;
    }).catch(error => {
      toast({
        title: 'Failed to fetch user milestones',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function getMilestone(milestoneId, includes = "user,comments,lists,checkpoints") {
    let promise = securedHttp.get("/api/v1/milestones/" + milestoneId, { params: { includes }})
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
  
  function createMilestone(formData) {
    let promise = securedHttp.post("/api/v1/milestones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }}
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
      milestone.value.comments = milestone.value.comments.filter(comment => comment.id!== commentId);
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
    let promise = securedHttp.post("/api/v1/milestones/" + milestoneId + "/checkpoints", checkpointProps)
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
    let promise = securedHttp.delete("/api/v1/milestones/" + milestoneId + "/checkpoints/" + checkpointId)
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

  return { userMilestones, milestone, loadUserMilestones, getMilestone, createMilestone, addComment, deleteComment, addCheckpoint, deleteCheckpoint }
})
