import { defineStore } from "pinia";
import Cookies from 'js-cookie'
import { ref } from 'vue'

interface CovidData {
date: string;
confirmedDiff: number;
deathsDiff: number;
activeDiff: number;
}

interface CovidResponseData {
date: string;
confirmed_diff: number;
deaths_diff: number;
active_diff: number;
}

export const useCovidData = defineStore("covid-data", () => {
  const dailyCases = ref<CovidData[]>([]);
  
      
  async function fetchCovidData() {
    dailyCases.value = JSON.parse(Cookies.get("dailyCases") || "[]");
    if (dailyCases.value.length > 0) {
      return;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dates: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const pastDate = new Date(yesterday);
      pastDate.setDate(yesterday.getDate() - i);
      dates.push(pastDate);
    }
    const apiPromises = dates.map((date) => {
      const isoDate = date.toISOString().slice(0, 10);
      const apiUrl = `https://covid-api.com/api/reports/total?date=${isoDate}&iso=UKR`;
      return fetch(apiUrl).then((response) => response.json()).then((response) => mapPromises(response.data));
    });
        
    const apiResponses = await Promise.all(apiPromises)

    dailyCases.value = apiResponses;    
    Cookies.set("dailyCases", JSON.stringify(apiResponses));
  }
    
  function deleteDailyCase(index: number) {
    if (index >= 0 && index < dailyCases.value.length) {
      dailyCases.value.splice(index, 1);
      Cookies.set("dailyCases", JSON.stringify(dailyCases.value));
    }
  }
    
  function mapPromises(promise: CovidResponseData) {
      return {
        date: promise.date,
        confirmedDiff: promise.confirmed_diff,
        deathsDiff: promise.deaths_diff,
        activeDiff: promise.active_diff,
      };
  }

  return { dailyCases, deleteDailyCase, fetchCovidData }
});
