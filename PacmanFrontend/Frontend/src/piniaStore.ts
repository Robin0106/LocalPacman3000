import { defineStore } from 'pinia'
import { ref, watch } from 'vue';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    name: null
  }),
  actions: {
    setUserId(id) {
      this.userId = id
      console.log("piniaStore: ", id, typeof id)
    },
    logout() {
      this.userId = null
      this.name = null;
      this.leaderboardVersion++;
    },
    setUsername(username) {
      this.name = username
      console.log("piniaStore: ", username)
    },
  },
  persist: true
})

export const useSoundStore = defineStore('sound', {
  state: () => ({
    volume: 0.5
  }),
  getters: {
    isMuted: (state) => state.volume === 0
  },
  actions: {
    toggleMute() {
      this.volume = this.isMuted ? 0.5 : 0;
    },
    setVolume(val: number) {
      this.volume = val;
    }
  },
  persist: {
    key: 'sound',
    paths: ['volume']
  }
});


