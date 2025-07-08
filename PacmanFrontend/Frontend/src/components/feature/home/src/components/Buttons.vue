<template>
  <div class="button-container">
    <div
      v-for="btn in buttons"
      :key="btn.label"
      class="button-wrapper"

    >
      <button
        class="button"
        :class="{ disabled: btn.disabled }"
        :disabled="btn.disabled"
        @click="!btn.disabled && btn.handler()"
        :title="btn.disabled && btn.tooltip ? btn.tooltip : null"
      >
        {{ btn.label }}
      </button>

    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ButtonsComponent",
  props: {
    buttons: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  min-height: 100vh;
  margin-top: 35rem;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.button-wrapper {
  position: relative;
}
.button {
  width: 17rem;
  height: 5rem;
  background-color: black;
  color: white;
  font-family: "Jersey 10", serif;
  border: none;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  font-size: 3rem;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  transform-origin: center;
}
.button:hover {
  transform: scale(1.02);
  font-size: 3.2rem;
  background-color: #222;
}
.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #333;
}
.tooltip {
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  white-space: nowrap;
}
</style>
