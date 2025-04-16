import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useMilestoneCompletionStore = defineStore('milestone_completion', () => {
  const milestone_completion = ref({})

  function getMilestoneCompletion(milestoneId) {
    let promise = securedHttp.get("/api/v1/milestone_completions" + milestoneId)
    promise.then(response => {
      milestone_completion.value = response.data
    }).catch(error => {
      toast({
        title: 'Failed to fetch milestone completion',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }
  
  function createMilestoneCompletion(formData) {
    let promise = securedHttp.post("/api/v1/milestone_completions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }}
    )
    promise.then(response => {
      milestone_completion.value = response.data;
    }).catch(error => {
      toast({
        title: 'Failed to create milestone',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  return { milestone_completion, getMilestoneCompletion, createMilestoneCompletion }
})
