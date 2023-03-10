<template>
    <table class="text-center w-full bg-slate-600 shadow-md rounded-lg border-white overflow-hidden">
        <thead class="text-slate-100 text-xl">
          <tr>
            <th class="py-3 px-4">Date</th>
            <th class="py-3 px-4">Confirmed Diff</th>
            <th class="py-3 px-4">Deaths Diff</th>
            <th class="py-3 px-4">Active Diff</th>
          </tr>
        </thead>
        <tbody class="text-slate-300">
          <tr v-for="(dailyCase, index) in dailyCases" :key="dailyCase.date">
            <td class="py-3 px-4">{{ dailyCase.date }}</td>
            <td class="py-3 px-4">{{ dailyCase.confirmedDiff }}</td>
            <td class="py-3 px-4">{{ dailyCase.deathsDiff }}</td>
            <td class="py-3 px-4">{{ dailyCase.activeDiff }}</td>
            <div class="flex">
              <button @click="deleteCase(index)" type="button" class="mt-4 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center mx-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                Delete
              </button>
            </div>
          </tr>
        </tbody>
    </table>
</template>
<script>
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'
import { useCovidData } from '../store/covid'

export default defineComponent({
    setup() {

    const covidStore = useCovidData()

    const { dailyCases } = storeToRefs(covidStore)

    function deleteCase(id) {
      covidStore.deleteDailyCase(id);
    }
    onMounted(() => {
      covidStore.fetchCovidData()
    })
    return { covidStore, dailyCases, deleteCase }
  },
})
</script>