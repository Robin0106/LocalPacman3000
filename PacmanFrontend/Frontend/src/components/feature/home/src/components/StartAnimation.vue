<!--
  This animation was fully created using ChatGPT.
  It has been officially approved by the supervising professor (Silas), provided that this note is included.
-->

<template>
  <div>
    <div class="black-overlay" v-show="showOverlay" ref="overlay"></div>
    <div class="pacman-container" v-show="showPacman">
      <svg id="pacman" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="yellow" />
        <polygon id="mouth" :points="mouthPoints" fill="black" />
      </svg>
    </div>
  </div>
</template>


<script lang="ts">
import { playSound } from '@/components/sounds/sounds';
import { useSoundStore } from '@/piniaStore';

export default {
  name: "StartAnimation",
  data() {
    return {
      showOverlay: false,
      showPacman: false,
      mouthPoints: "50,50 100,20 100,80",
      pacmanDuration: 1.5,
      designWidth: 1920
    };
  },
  methods: {
    startTransition() {
      const soundStore = useSoundStore();
      if (!soundStore.isMuted) {
        playSound("intro");
      }
      this.showOverlay = true;
      this.showPacman = true;
      this.$nextTick(() => {
        const pacman = document.getElementById("pacman");
        const overlay = this.$refs.overlay;


        const W = overlay.clientWidth;

        const distance = W + 100;

        const duration = this.pacmanDuration * (W / this.designWidth);


        pacman.style.setProperty("--pacman-distance", `${distance}px`);
        pacman.style.animationDuration = `${duration}s`;


        pacman.classList.add("move");


        let open = true;
        const eatInterval = setInterval(() => {
          this.mouthPoints = open
            ? "50,50 100,40 100,60"
            : "50,50 100,20 100,80";
          open = !open;
        }, 150);


        this.createPixels(overlay);
        overlay.classList.add("fill");


        setTimeout(() => {
          clearInterval(eatInterval);
          this.$router.push("/ingame");
        }, duration * 1000 + 300);
      });
    },

    createPixels(overlay) {

      const W = overlay.clientWidth;
      const H = overlay.clientHeight;


      const pixelSize = Math.max(W, H) / 15;
      const cols = Math.ceil(W / pixelSize);
      const rows = Math.ceil(H / pixelSize);


      overlay.style.display = "grid";
      overlay.style.gridTemplateColumns = `repeat(${cols}, ${pixelSize}px)`;
      overlay.style.gridTemplateRows    = `repeat(${rows}, ${pixelSize}px)`;
      overlay.style.gridGap             = "-2px";


      overlay.innerHTML = "";
      for (let i = 0; i < cols * rows; i++) {
        const px = document.createElement("div");
        px.classList.add("pixel");
        px.style.animationDelay = `${Math.random() * 0.6}s`;
        overlay.appendChild(px);
      }
    },
  },
  mounted() {
    this.startTransition();
  },
};
</script>

<style scoped>
.black-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 1000;
  display: grid;
  pointer-events: none;
  overflow: hidden;
  grid-gap: -2px;
}

:deep(.pixel) {
  width: calc(var(--pixel-size) + 2px);
  height: calc(var(--pixel-size) + 2px);
  margin: -1px;
  background-color: black;
  opacity: 0;
  transform: scale(0);
}

:deep(.fill .pixel) {
  animation: pixelFade 0.6s forwards;
}

@keyframes pixelFade {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}

.pacman-container {
  position: absolute;
  top: 50%;
  left: 0;
  width: 50px;
  height: 50px;
  transform: translateY(-50%);
  z-index: 1001;
}

#pacman {
  width: 100px;
  height: 100px;

  --pacman-distance: 2000px;
}

.move {
  animation-name: moveAcross;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;

}

@keyframes moveAcross {
  from { transform: translateX(-150px) translateY(-50%); }
  to   { transform: translateX(var(--pacman-distance)) translateY(-50%); }
}
</style>
