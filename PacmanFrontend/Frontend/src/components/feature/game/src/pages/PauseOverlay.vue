<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { useSoundStore } from '@/piniaStore';
  import mute from '@/assets/Mute.png';
  import unmute from '@/assets/Unmute.png';

  const soundStore = useSoundStore();

  const muteImg = mute;
  const unmuteImg = unmute;

  const emit = defineEmits(['resume', 'mute','unmute']);
  const router = useRouter();

  const visualScore = ref("");

  const props = defineProps<{
    score: number,
  }>();

  const formatScore = (val: number | null): string => {
    return val !== null ? val.toLocaleString("de-DE") : "...";
  };
  visualScore.value = formatScore(props.score);

  function goHome() {
    router.push('/');
  }


  function toggleMute() {
    soundStore.toggleMute();
  }
</script>

<template>
    <div class="pause-overlay">
        <div class="pause-content">
            <button @click="toggleMute" class="mute-button">
              <img :src="soundStore.isMuted ? muteImg : unmuteImg" :alt="soundStore.isMuted ? 'Ton aus' : 'Ton an'" class="mute-img" />
            </button>
            <h1>Game Paused</h1>
            <p>Press "Resume" to continue playing.</p>
            <p>Press "Home" to go back to the main menu.</p>
            <p>Current Points: {{ visualScore }}</p>
            <button class="button resume" @click="$emit('resume')">Resume</button>
            <button class="button home" @click="goHome">Home</button>
        </div>
    </div>
</template>

<style scoped>

.pause-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-content {
  position: relative;
  font-family: "Jersey 10", serif;
  padding: 3rem 5rem 7rem 5rem;
  border-radius: 2rem;
  text-align: center;
  box-shadow: 0 0 30px #000;
  background-color: #183446;
  min-width: 500px;
  min-height: 350px;
}

.pause-content h1 {
  font-size: 5rem;
  letter-spacing: 2px;
  color: yellow;
}

.pause-content p {
  font-size: 2rem;
  color: white;
}

.button {
  position: absolute;
  display: inline-block;
  width: 40%;
  text-align: center;
  font-family: "Jersey 10", serif;
  font-size: 2.5rem;
  padding: 0.5rem 2rem;
  border-radius: 1rem;
  border: none;
  background-color: black;
  color: white;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  transition: 0.2s ease-in-out;
  cursor: pointer;
}


.mute-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mute-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: block;
}

.mute-button:hover {
  transform: scale(1.02);
  font-size: 2.7rem;
  background-color:  #183446;
}

.resume {
  right: 2rem;
  bottom: 2rem;
}

.home {
  left: 2rem;
  bottom: 2rem;
}

.button:hover {
  transform: scale(1.02);
  font-size: 2.7rem;
  background-color: #222;
}
</style>
