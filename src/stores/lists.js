import { ref } from 'vue'
import { defineStore } from 'pinia'
import { securedHttp } from '@/axios'
import { toast } from '@/components/ui/toast'

export const useListsStore = defineStore('lists', () => {
  const lists = ref([])
  const list = ref({})

  function loadLists() {
    return securedHttp.get("/api/v1/lists").then(response => {
      lists.value = response.data;
    }).catch(error => {
      toast({
        title: 'Failed to fetch lists',
        description: error.message,
        variant: "destructive"
      })
    })
  }

  function getListDetails(listId, includes = "milestones") {
    let promise = securedHttp.get("/api/v1/lists/" + listId, { params: { includes }})
    promise.then(response => {
      list.value = response.data
    }).catch(error => {
      toast({
        title: 'Failed to fetch list',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function createList(listData) {
    let promise = securedHttp.post("/api/v1/lists", listData)
    promise.then(response => {
      lists.value.push(response.data);
      toast({
        title: 'List created successfully',
        description: response.data.name,
        variant: "default"
      })
    }).catch(error => {
      toast({
        title: 'Failed to create list',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function deleteList(listId) {
    let promise = securedHttp.delete("/api/v1/lists/" + listId)
    promise.then(response => {
      list.value = response.data

      console.log(listId)
      const index = lists.value.findIndex(list => list.id === listId);
      console.log(index)
      if (index !== -1) {
        lists.value.splice(index, 1); // Remove the list from the array
      }
    }).catch(error => {
      toast({
        title: 'Failed to delete list',
        description: error.message,
        variant: "destructive"
      })
    })
    return promise;
  }

  function updateList(listId, listData) {
    let promise = securedHttp.put("/api/v1/lists/" + listId, { ...listData, includes: "milestones" });
  
    promise.then(response => {
      list.value = response.data;
      const index = lists.value.findIndex(l => l.id === response.data.id); 
      if (index !== -1) {
        lists.value[index] = response.data;
      }
      toast({
        title: 'List updated successfully',
        description: response.data.name,
        variant: "default"
      });
  
    }).catch(error => {
      toast({
        title: 'Failed to update list',
        description: error.message,
        variant: "destructive"
      });
    });
  
    return promise;
  }

  function addMilestoneToList(listId, milestoneId) {
    let promise = securedHttp.post("/api/v1/lists/" + listId + "/add_milestone", { milestone_id: milestoneId });

    promise.then(() => {
      toast({
        title: 'Milestone added to list',
        variant: "default"
      });
  
    }).catch(error => {
      toast({
        title: 'Failed to add milestone to list',
        description: error.message,
        variant: "destructive"
      });
    });

    return promise;
  }
  

  return { lists, list, loadLists, createList, getListDetails, deleteList, updateList, addMilestoneToList }
})
