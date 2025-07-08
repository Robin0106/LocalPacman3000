<script setup lang="ts">
import {onMounted, ref} from 'vue';

  onMounted(() => {
    fetchScore();
  });

  const props = defineProps <{
    id: number
    name: string
  }>();

  const highscore = ref(0);
  const user = ref("Could not load data");

  const formatScore = (val: number | null): string => {
    return val !== null ? val.toLocaleString("de-DE") : "...";
  };

  const fetchScore = async () => {
    const rankID = props.id
    console.log("VITE_BASE_URL + path: ", import.meta.env.VITE_BASE_URL + `api/homepage/leaderboard?rankID=${rankID}`)
    try {
      const response = await fetch(import.meta.env.VITE_BASE_URL + `api/homepage/leaderboard?rankID=${rankID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json(); // z.B. { score: 3123 }

      highscore.value = data.score;
      user.value = data.name;

      return highscore;
    } catch (error) {
      console.error('Fehler beim Abrufen des Highscores:', error);
    }
  };

</script>

<template>
  <span class="grid">
    <a class="id"> {{ props.id }}. </a>
    <a class="name"> {{ user }} </a>
    <a class="points"> {{ formatScore(highscore) }} </a>
  </span>
</template>

<style scoped>

.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
  font-size: 2rem;
  align-items: center;
}

.id {
  justify-self: start;
}

.name {
  justify-self: center;
}

.points {
  justify-self: end;
}

</style>
