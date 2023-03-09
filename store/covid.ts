import { defineStore } from "pinia";
import Cookies from 'js-cookie'

interface CovidData {
date: string;
confirmedDiff: number;
deathsDiff: number;
activeDiff: number;
}

interface CovidDataState {
dailyCases: CovidData[];
}

export const useCovidData = defineStore({
  id: "covid-data",
  state: (): CovidDataState => {
    return {
      dailyCases: [],
    };
  },
  actions: {
    async fetchCovidData() {
      this.dailyCases = JSON.parse(Cookies.get("dailyCases") || "[]");
      if (this.dailyCases.length > 0) {
        return;
      }
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dates = [];
      for (let i = 0; i < 5; i++) {
        const pastDate = new Date(yesterday);
        pastDate.setDate(yesterday.getDate() - i);
        dates.push(pastDate);
      }
      const apiPromises = dates.map((date) => {
        const isoDate = date.toISOString().slice(0, 10);
        const apiUrl = `https://covid-api.com/api/reports/total?date=${isoDate}&iso=UKR`;
        return fetch(apiUrl).then((response) => response.json());
      });
      const apiResponses = await Promise.all(apiPromises);
      const dailyCases = apiResponses
        .map((response, index) => {
          const date = dates[index].toISOString().slice(0, 10);
          return {
            date: date,
            confirmedDiff: response.data.confirmed_diff,
            deathsDiff: response.data.deaths_diff,
            activeDiff: response.data.active_diff,
          };
        })
        .reverse();
      this.dailyCases = dailyCases;
      Cookies.set("dailyCases", JSON.stringify(dailyCases));
    },
    deleteDailyCase(index: number) {
      if (index >= 0 && index < this.dailyCases.length) {
        this.dailyCases.splice(index, 1);
        Cookies.set("dailyCases", JSON.stringify(this.dailyCases));
      }
    },
  },
  getters: {
    getDailyCases: (state) => state.dailyCases,
  },
});
