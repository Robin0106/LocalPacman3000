<template>
  <div class="howto-overlay" @click.self="close">
    <div class="howto-popup">
      <button class="close-btn" @click="close">×</button>
      <div class="carousel">
        <button class="arrow left" @click.stop="prev" :disabled="isFirst">‹</button>
        <div class="image-container" @click.self="close">
          <img
            :src="images[currentIndex]"
            alt="How To Guide"
            draggable="false"
            @dragstart.prevent
          />
        </div>
        <button class="arrow right" @click.stop="next" :disabled="isLast">›</button>
      </div>
      <div class="indicators">
        <span
          v-for="(_, idx) in images"
          :key="idx"
          class="dot"
          :class="{ active: idx === currentIndex }"
          @click="goTo(idx)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import howto1 from '@/assets/howto1.png';
import howto2 from '@/assets/howto2.png';
import howto3 from '@/assets/howto3.png';
import howto4 from '@/assets/howto4.png';

export default {
  name: 'HowToPopup',
  emits: ['close'],
  data() {
    return {
      currentIndex: 0,
      images: [howto1, howto2, howto3, howto4],
    };
  },
  computed: {
    isFirst() {
      return this.currentIndex === 0;
    },
    isLast() {
      return this.currentIndex === this.images.length - 1;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    prev() {
      if (!this.isFirst) this.currentIndex--;
    },
    next() {
      if (!this.isLast) this.currentIndex++;
    },
    goTo(idx) {
      this.currentIndex = idx;
    },
  },
};
</script>

<style scoped>
.howto-overlay {
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

.howto-popup {
  position: relative;
  background: transparent;
  padding: 0;
  transform: translateY(-5%);
}

.close-btn {
  position: absolute;
  top: 6.5rem;
  right: 10rem;
  background: none;
  border: none;
  font-size: 4rem;
  cursor: pointer;
  color: white;
  z-index: 1;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
}

.image-container {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.image-container img {
  transform: scale(0.8);
  transform-origin: center;
  display: block;

  -webkit-user-drag: none;
  user-drag: none;
  user-select: none;
}

.arrow {
  background: none;
  border: none;
  font-size: 10rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0 1rem;
  margin: 0 -3rem;
  color: white;
  user-select: none;
}

.arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.dot {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 0.5rem 2rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.dot.active {
  background: white;
}
</style>
