<template>
  <div class="background-layer"></div>
    <div class="main-container">
      <div class="header-container">
        <div v-if="coins !== null" class="coin-display">
          <img src="@/assets/PNGs/Coins Overlay.png" class="coin-icon" alt="Coins">
          <span class="coin-amount">{{ formatCoins(coins) }}</span>
        </div>
        <div class="button-container">
          <Home />
        </div>
      </div>
      <div class="grid-wrapper">
        <SkinsComponent
          @updateCoins="
          (price, done) => {
            updateCoins(price)
            .then(success => done(success))
            .catch(()   => done(false))
          }"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import SkinsComponent from '../components/Skins.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/piniaStore';
import { onMounted, ref } from 'vue';
import Home from "@/components/feature/login/src/components/Home.vue";


defineOptions({
  name: 'LockerComponent',
});

const router = useRouter();
const userStore = useUserStore();
const playerId = userStore.userId;
const coins = ref<number | null>(null);

const formatCoins = (val: number | null): string => {
  return val !== null ? val.toLocaleString("de-DE") : "...";
};

const fetchCoins = async () => {
  if (!playerId) {
    console.log('Player ID fehlt. Coins kann nicht abgefragt werden.');
    return;
  }
  console.log('Coins abgerufen');
  try {
    const response = await fetch(import.meta.env.VITE_BASE_URL + `api/shop?playerID=${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const coins = await response.json();

    console.log('Coins:', coins);
    return coins;
  } catch (error) {
    console.error('Fehler beim Abrufen der Coins:', error);
  }
}

const updateCoins = async (skinPrice: number): Promise<boolean> => {
  if (!playerId || !coins.value) {
    console.log('Player ID is not set or no coins. Cannot update coins.');
    return false;
  }
  if (coins.value < skinPrice) {
    console.log('Not enough coins to purchase skin.');
    return false;
  }
  try {
    const response = await fetch(import.meta.env.VITE_BASE_URL + `api/shop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerID: playerId,
        coins: coins.value,
        price: skinPrice,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      return false;
    }
    coins.value = await response.json();
    console.log('Coins updated successfully. New Coins:', coins.value);
    return true;
  } catch (error) {
    console.error('Error updating coins :', error);
    return false;
  }
}

onMounted(() => {
  fetchCoins().then((playerCoins) => {
    coins.value = playerCoins;
  });
})

</script>

<style>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #162034;
  z-index: -1;
}

::-webkit-scrollbar {
  display: none;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  height: calc(100vh - 80vh);
  min-height: 80px;
}

.coin-amount {
  color: gold;
  font-weight: bold;
}

.grid-wrapper {
  height: calc(100vh - 20vh);
  overflow-y: scroll;
  overflow-x: hidden;
}

@media (max-width: 1366px) {
  .button-container {
    height: calc(100vh - 87vh);
  }

  .grid-wrapper {
    height: calc(100vh - 13vh);
    overflow-y: auto;
    overflow-x: hidden;
  }
}


.coin-display {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: #0d111a;
  padding: 0.6rem 1.2rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: "Jersey 10", sans-serif;
  font-size: 1.9rem;
  color: yellow;
  text-shadow: 0 0 5px black;
  z-index: 999;
}

.coin-icon {
  width: 2.5rem;
  height: 2.5rem;
  filter: drop-shadow(0 0 2px black);
}


</style>
