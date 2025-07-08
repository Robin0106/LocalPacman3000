<template>
  <div class="skin-container">
    <div
      v-for="(skin, index) in displayedSkins"
      :key="index"
      class="flex-container"
      :class="{ locked: !isSkinUnlocked(index + 1) }"
    >
      <img
        :src="ButtonID === index + 1 ? skin.srcGIF : skin.srcPNG"
        class="stylingGIF"
        :alt="skin.name"
      />

      <template v-if="!isSkinUnlocked(index + 1)">
        <div class="lock-overlay" @click="showPreview(skin, index + 1)">
          <div class="lock-icon">
            <img src="@/assets/PNGs/LockForLocker.png" alt="locked" />
          </div>
          <div class="lock-content">
            <div class="price-tag">{{ formatPrice(skin.price) }}</div>
          </div>

        </div>
      </template>

      <template v-else>
        <ButtonComponent
          :label="ButtonID === index + 1 ? 'ACTIVE' : 'SELECT'"
          class-name="Select-Button"
          active-class="selectedButton"
          :is-active="ButtonID === index + 1"
          @click="handleSelect(index + 1, skin.srcGIF)"
        />
      </template>
    </div>
  </div>

  <template v-if="previewVisible && previewSkinData">
    <div class="modal-backdrop" @click="closePreview">
      <div class="modal-content preview-custom" @click.stop>
        <div class="modal-header">SKIN PREVIEW</div>
        <div class="price-preview">{{ formatPrice(previewSkinData.price) }}</div>
        <img :src="previewSkinData.srcGIF" alt="Preview Skin" class="preview-gif" />
        <ButtonComponent
          label="BUY"
          class-name="Select-Button"
          @click="buySkin(previewSkinData.id, previewSkinData.price)"
        />
        <button class="close-btn" @click="closePreview">✕</button>
      </div>
    </div>
  </template>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ButtonComponent from './Button.vue';
import { useUserStore } from '@/piniaStore';
import { showToast } from "@/components/devPanel/ToastManager.vue";


import skin1PathGIF from '@/assets/GIFs/pacman.gif';
import skin1PathPNG from '@/assets/PNGs/Pacman2.png';

import skin2PathGIF from '@/assets/GIFs/Cheese.gif';
import skin2PathPNG from '@/assets/PNGs/Cheese2.png';

import skin3PathGIF from '@/assets/GIFs/Tomato.gif';
import skin3PathPNG from '@/assets/PNGs/Tomato2.png';

import skin4PathGIF from '@/assets/GIFs/Moon.gif';
import skin4PathPNG from '@/assets/PNGs/Moon2.png';

import skin5PathGIF from '@/assets/GIFs/Pizza.gif';
import skin5PathPNG from '@/assets/PNGs/Pizza2.png';

import skin6PathGIF from '@/assets/GIFs/Shrek.gif';
import skin6PathPNG from '@/assets/PNGs/Shrek2.png';

import skin7PathGIF from '@/assets/GIFs/Pokeball.gif';
import skin7PathPNG from '@/assets/PNGs/Pokeball2.png';

import skin8PathGIF from '@/assets/GIFs/Energy.gif';
import skin8PathPNG from '@/assets/PNGs/Energy2.png';

import skin9PathGIF from '@/assets/GIFs/Earth.gif';
import skin9PathPNG from '@/assets/PNGs/Earth2.png';

import skin10PathGIF from '@/assets/GIFs/Deathstar.gif';
import skin10PathPNG from '@/assets/PNGs/Deathstart2.png';

import skin11PathGIF from '@/assets/GIFs/Fish.gif';
import skin11PathPNG from '@/assets/PNGs/Fish2.png';

import skin12PathGIF from '@/assets/GIFs/Hog.gif';
import skin12PathPNG from '@/assets/PNGs/Hog2.png';

import skin13PathGIF from '@/assets/GIFs/Angel.gif';
import skin13PathPNG from '@/assets/PNGs/Angel2.png';

import skin14PathGIF from '@/assets/GIFs/MissPacman.gif';
import skin14PathPNG from '@/assets/PNGs/MissPacman2.png';

import skin15PathGIF from '@/assets/GIFs/Galaxy.gif';
import skin15PathPNG from '@/assets/PNGs/GalaxyShiny2.png';


const selectedSkinStorage = 'selectedSkin:v2';

const skinsUnlocked = ref<Set<number>>(new Set());
const previewSkinData = ref<{ id: number, price: number, srcGIF: string } | null>(null);

const formatPrice = (val: number): string => {
  return val.toLocaleString("de-DE");
};

const userStore = useUserStore();
const playerId = userStore.userId;

const emit = defineEmits<{
  (e: 'updateCoins', price: number, done: (success: boolean) => void): void
}>();

defineOptions({
  name: 'SkinsComponent'
});

interface Skin {
  name: string;
  srcGIF: string;
  srcPNG: string;
  price : number;
}

const ButtonID = ref<number | null>(null);

const displayedSkins: Skin[] = [
  { name: 'Pacman', srcGIF: skin1PathGIF, srcPNG: skin1PathPNG, price: 0 },
  { name: 'Cheese', srcGIF: skin2PathGIF, srcPNG: skin2PathPNG, price: 10000 },
  { name: 'Tomato', srcGIF: skin3PathGIF, srcPNG: skin3PathPNG, price: 10000 },
  { name: 'Moon', srcGIF: skin4PathGIF, srcPNG: skin4PathPNG, price: 10000 },
  { name: 'Pizza', srcGIF: skin5PathGIF, srcPNG: skin5PathPNG, price: 10000 },

  { name: 'Shrek', srcGIF: skin6PathGIF, srcPNG: skin6PathPNG, price: 50000 },
  { name: 'Pokeball', srcGIF: skin7PathGIF, srcPNG: skin7PathPNG, price: 50000 },
  { name: 'Energy', srcGIF: skin8PathGIF, srcPNG: skin8PathPNG, price: 50000 },
  { name: 'Earth', srcGIF: skin9PathGIF, srcPNG: skin9PathPNG, price: 50000 },
  { name: 'Deathstar', srcGIF: skin10PathGIF, srcPNG: skin10PathPNG, price: 50000 },

  { name: 'Fish', srcGIF: skin11PathGIF, srcPNG: skin11PathPNG, price: 100000 },
  { name: 'Hog', srcGIF: skin12PathGIF, srcPNG: skin12PathPNG, price: 100000 },
  { name: 'Angel', srcGIF: skin13PathGIF, srcPNG: skin13PathPNG, price: 100000 },
  { name: 'MissPacman', srcGIF: skin14PathGIF, srcPNG: skin14PathPNG, price: 100000 },
  { name: 'Galaxy', srcGIF: skin15PathGIF, srcPNG: skin15PathPNG, price: 500000 }
];


const defaultIndex = displayedSkins.findIndex(s => s.price === 0) + 1;
const defaultSelectedSkin = displayedSkins[defaultIndex - 1].srcGIF;

const previewVisible = ref(false);
const previewSrc     = ref<string | null>(null);


onMounted(() => {
  if(!playerId) {
    skinsUnlocked.value.add(1);
  }
  localStorage.removeItem('skinsUnlocked:v1');
  for (let i = 1; i <= displayedSkins.length; i++) {
    fetchSkin(i).then(isUnlocked => {
      if (isUnlocked) {
        skinsUnlocked.value.add(i);
      }
    });
  }


  const storedSkin = localStorage.getItem(selectedSkinStorage)
  if(!playerId){
    ButtonID.value = defaultIndex
    localStorage.setItem(selectedSkinStorage, defaultSelectedSkin)
  } else if (storedSkin) {
    const i = displayedSkins.findIndex(s => s.srcGIF === storedSkin)
    ButtonID.value = i !== -1 ? i + 1 : defaultIndex
    if (i === -1) {
      localStorage.setItem(selectedSkinStorage, defaultSelectedSkin)
    }
  } else {
    ButtonID.value = defaultIndex
    localStorage.setItem(selectedSkinStorage, defaultSelectedSkin)
  }
});

function handleSelect(id: number, srcGIF: string) {
  ButtonID.value = id
  localStorage.setItem(selectedSkinStorage, srcGIF)
  window.dispatchEvent(new StorageEvent('storage', {
    key: selectedSkinStorage,
    newValue: srcGIF
  }))
}


function showPreview(skin: Skin, id: number) {
  previewSrc.value     = skin.srcGIF;
  previewVisible.value = true;
  previewSkinData.value = {
    id,
    price: skin.price,
    srcGIF: skin.srcGIF
  };
}

function closePreview() {
  previewVisible.value = false
  previewSrc.value     = null
}

function buySkin(id: number, price: number) {
  emit('updateCoins', price, (success) => {
    if (success) {
      skinsUnlocked.value.add(id);
      unlockSkin(id);
      console.log('Skin purchased and coins updated.');
      showToast("Skin purchased!", "success");
      closePreview(); // nur bei Erfolg!
    } else {
      showToast("Not enough pills", "error");
      console.log('Could not update coins – skin not unlocked.');
    }
  })
}


function isSkinUnlocked(id: number): boolean {
  return skinsUnlocked.value.has(id)
}

const unlockSkin = async (id: number) => {
  console.log("Unlocking skin with ID:", id);
  try {
    const response = await fetch(import.meta.env.VITE_BASE_URL + `api/skin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerID: playerId,
        skinID: id
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    console.log('Skin unlocked successfully:', id);
  } catch (error) {
    console.error('Skin unlock failed: ', error);
  }
};

const fetchSkin = async (id: number) => {
  try {
    const params = new URLSearchParams({
      playerID: String(playerId),
      skinID: String(id)
    });
    const response = await fetch(import.meta.env.VITE_BASE_URL + `api/skin?` + params.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const isUnlocked = await response.json();

    console.log('Unlocked:', isUnlocked);
    return isUnlocked;
  } catch (error) {
    console.error('Error while checking if skin is unlocked:', error);
  }
};
</script>


<style>
.skin-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2vw;
  max-width: 1200px;
  width: 100vw;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
}

.flex-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4.99%;
  border: 5px solid white;
  width: 12rem;
  height: 12rem;
  padding: 0.5rem;
  padding-bottom: 20px;
  box-sizing: border-box;
  background-color: #0d111a;
  position: relative;
  overflow: hidden;
}

.stylingGIF {
  width: auto;
  height: 6.25rem;
  margin-top: 0.9375rem;
  z-index: 1;
}

@media (max-width: 1366px)  {
  .stylingGIF {
    height: 5rem;
  }
}

@media (max-width: 1024px)  {
  .skin-container {
    grid-template-columns: repeat(3, 1fr);
  }
  .stylingGIF {
    height: 4rem;
  }
}

@media (max-width: 800px) {
  .skin-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .stylingGIF {
    height: 3rem;
  }
}

@media (max-height: 900px) {
  .stylingGIF {
    height: 5rem;
  }
}

@media (max-height: 700px) {
  .stylingGIF {
    height: 5rem;
  }
}

@media (max-height: 600px) {
  .stylingGIF {
    height: 5rem;
  }
}

.locked {
  position: relative;
  filter: grayscale(40%);
  opacity: 0.85;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
  backdrop-filter: blur(0.5px);
  cursor: pointer;
}

.lock-overlay::after {
  content: "PREVIEW";
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  color: white;
  font-family: "Jersey 10", sans-serif;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 5;
}

.lock-overlay:hover::after {
  opacity: 1;
}


.lock-icon img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 7rem;
  height: 7rem;
  pointer-events: none;
}

.price-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 4;
}

.price-tag {
  color: #bbb;
  font-size: 2.4rem;
  font-weight: bold;
  text-shadow: 0 0 4px #000;
  font-family: "Jersey 10", serif;
}


.lock-content {
  position: absolute;
  bottom: -0.65rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 4;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: #162034;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-gif {
  width: 8rem;
  height: 8rem;
  margin-bottom: 3em;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;
}

.close-btn:hover {
  color: yellow;
  transform: scale(1.1);
}

.modal-content.preview-custom {
  animation: zoomIn 0.2s ease-out;
  width: 22rem;
  height: auto;
  padding: 2rem 1.5rem;
  border-radius: 1.5rem;
  background: linear-gradient(to bottom right, #101924, #19293a);
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.07);
}

@keyframes zoomIn {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.price-preview {
  font-size: 2.5rem;
  color: white;
  font-family: "Jersey 10", sans-serif;
  margin-bottom: 1rem;
  text-shadow: 0 0 4px black;
}

.modal-header {
  font-family: "Jersey 10", sans-serif;
  color: yellow;
  font-size: 2.8rem;
  margin-bottom: -1rem;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(255, 212, 76, 0.4);
}

</style>
