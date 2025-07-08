<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import GameField from '../components/GameField.vue';

function updateZoomDynamically() {
  const BASE_WIDTH = 1800;
  const BASE_HEIGHT = 900;

  const scaleX = window.innerWidth / BASE_WIDTH;
  const scaleY = window.innerHeight / BASE_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1);

  document.documentElement.style.zoom = scale.toFixed(3);
}

onMounted(() => {
  updateZoomDynamically();
  window.addEventListener('resize', updateZoomDynamically);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateZoomDynamically);
  document.documentElement.style.zoom = '1.0';
});
</script>

<template>
  <div class="page-container">
    <GameField class="field-box" />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: black;
}

.field-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
