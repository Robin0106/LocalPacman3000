<script setup lang="ts">
import {onMounted, ref} from "vue";
  import {useUserStore} from "@/piniaStore";

  onMounted(() => {
    selectStats();
  });

  const props = defineProps <{
    statID: number
    tag: string
    stat: string
  }>();

  const userStore = useUserStore();
  const playerId = userStore.userId;

  const statResult = ref("0");

  const formatScore = (val: number | null): string => {
    return val !== null ? val.toLocaleString("de-DE") : "...";
  };

  const selectStats = async () => {
    console.log("selcetStats called, statID: ", props.statID);

    switch (props.statID) {
      case 1:
        console.log("case: ", props.statID);
        await fetchHighscore();
        break
      case 2:
        console.log("case: ", props.statID);
        await fetchLastScore();
        break
      case 3:
        console.log("case: ", props.statID);
        await fetchGamesPlayed();
        break
      case 4:
        console.log("case: ", props.statID);
        await fetchTotalPlayTime();
        break
      case 5:
        console.log("case: ", props.statID);
        await fetchHighestLevel();
        break
      case 6:
        console.log("case: ", props.statID);
        await fetchTotalGhostsEaten();
        break
    }
  }

  const fetchHighscore = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/statistics/highscore?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const highscore = await response.json();

      statResult.value = formatScore(highscore);
      return highscore;
    } catch (error) {
      console.error('Fehler beim Abrufen des Highscores:', error);
    }
  }

  const fetchLastScore = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/statistics/lastscore?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const lastScore = await response.json();

      statResult.value = formatScore(lastScore);
      return lastScore;
    } catch (error) {
      console.error('Fehler beim Abrufen des Letzten Scores:', error);
    }
  }

  const fetchGamesPlayed = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/statistics/gamesplayed?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const gamesPlayed = await response.json();

      statResult.value = formatScore(gamesPlayed);
      return gamesPlayed;
    } catch (error) {
      console.error('Fehler beim Abrufen des Letzten Scores:', error);
    }
  }

  const fetchTotalPlayTime = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/statistics/totalplaytime?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const totalPlayTime = await response.json();

      statResult.value = formatScore(totalPlayTime);
      return totalPlayTime;
    } catch (error) {
      console.error('Fehler beim Abrufen des Letzten Scores:', error);
    }
  }

  const fetchHighestLevel = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/statistics/highestlevel?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const highestLevel = await response.json();

      statResult.value = formatScore(highestLevel);
      return highestLevel;
    } catch (error) {
      console.error('Fehler beim Abrufen des Letzten Scores:', error);
    }
  }

  const fetchTotalGhostsEaten = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/statistics/totalghostseaten?playerId=${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const totalGhostsEaten = await response.json();

      statResult.value = formatScore(totalGhostsEaten);
      return totalGhostsEaten;
    } catch (error) {
      console.error('Fehler beim Abrufen des Letzten Scores:', error);
    }
  }

</script>

<template>
  <div class="stat-group">
    <p class="stat-title"> {{ props.tag }}</p>
    <p class="stat-value"> {{ statResult }} </p>
  </div>
</template>

<style scoped>
  .stat-group {
    margin-bottom: -1.2rem;
  }

  .stat-title {
    margin-bottom: -0.75rem;
    font-size: 2.5rem;
  }

  .stat-value {
    margin-bottom: 1.5rem;
    font-size: 1.6rem;

  }
</style>
