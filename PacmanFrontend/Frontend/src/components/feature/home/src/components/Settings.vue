<template>
  <div class="settings-overlay" @click.self="close">
    <div class="settings-popup">
      <button class="close-btn" @click="close">×</button>

      <div class="settings-container">
        <h2>Settings</h2>

        <button @click="toggleMute" class="mute-button">
          <img
            :src="isSoundMuted ? muteImg : unmuteImg"
            :alt="isSoundMuted ? 'Sound off' : 'Sound on'"
            class="mute-img"
          />
        </button>

        <!-- Volume Slider -->
        <label for="volume">Soundeffects:</label>
        <input
          id="volume"
          type="range"
          min="0"
          max="100"
          v-model="volumeUI"
        />
        <p>{{ volumeUI }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSoundStore } from '@/piniaStore';
import mute from '@/assets/Mute.png';
import unmute from '@/assets/Unmute.png';

const emit = defineEmits(['close']);
const soundStore = useSoundStore();

const volumeUI = computed({
  get: () => Math.round(soundStore.volume * 100),
  set: (val) => (soundStore.volume = val / 100),
});

const isSoundMuted = computed(() => soundStore.isMuted);

function toggleMute() {
  soundStore.toggleMute();
}

function close() {
  emit('close');
}

const muteImg = mute;
const unmuteImg = unmute;
</script>


<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.settings-popup {
  position: relative;
  background: #222;
  padding: 4rem;
  border-radius: 1rem;
  color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  width: 450px;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  color: white;
  z-index: 1;
}

.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-top: 1rem;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  margin-top: 0.5rem;
}

.mute-button {
  margin-bottom: 1rem;
  width: 58px;
  height: 58px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mute-img {
  width: 58px;
  height: 58px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.mute-button:hover .mute-img {
  transform: scale(1.1);
}

.settings-container h2 {
  font-size: 3rem;
}

.settings-container label {
  font-size: 2rem;
  margin-top: 1.2rem;
  font-weight: normal;
}

.settings-container p {
  font-size: 1.5rem;
  margin-top: 0.4rem;
}
</style>
