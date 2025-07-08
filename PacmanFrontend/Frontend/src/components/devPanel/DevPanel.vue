<template>
  <div v-if="visible" class="dev-panel">
    <h3>🛠 Dev Panel</h3>
    <button @click="show('Standard')" class="dev-btn">Standard</button>
    <button @click="show('Erfolg!', 'success')" class="dev-btn success">Success</button>
    <button @click="show('Info Hinweis', 'info')" class="dev-btn info">Info</button>
    <button @click="show('Fehler aufgetreten!', 'error')" class="dev-btn error">Error</button>
  </div>
</template>

<script lang="ts">
import { showToast } from "@/components/devPanel/ToastManager.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

type ToastType = 'default' | 'success' | 'info' | 'error';

export default {
  name: "DevPanel",
  setup() {
    const visible = ref(false);

    const show = (msg: string, type: ToastType = "default") => {
      showToast(msg, type);
    };

    const toggle = () => {
      visible.value = !visible.value;
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "p") {
        toggle();
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", handleKey);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKey);
    });

    return { show, visible, toggle };
  }
};
</script>

<style scoped>
.dev-panel {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: rgba(24, 52, 70, 0.95);
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  z-index: 9999;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
}

.dev-btn {
  margin: 0.2rem;
  padding: 0.4rem 1rem;
  background: #444;
  color: white;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
}
.dev-btn.success {
  background: #4caf50;
}
.dev-btn.error {
  background: #f44336;
}
.dev-btn.info {
  background: #2196f3;
}

.dev-btn:hover {
  opacity: 0.9;
}
</style>
