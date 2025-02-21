import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useMilestonesStore = defineStore('milestones', () => {
  const milestones = ref([])
  const milestone = ref({})

  function loadMilestones() {
    return securedHttp.get("/api/v1/milestones").then(response => {
      milestones.value = response.data;
    }).catch(error => {
      toast({
        title: 'Failed to fetch milestones',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function getMilestone(milestoneId) {
    let promise = securedHttp.get("/api/v1/milestone/" + milestoneId)
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
      milestones.value.push(response.data);
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

  return { milestones, milestone, loadMilestones, getMilestone, createMilestone }
})
