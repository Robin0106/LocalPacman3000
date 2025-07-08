<template>
  <div class="toast-wrapper">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      class="toast"
      :class="toast.type"
    >
      <img :src="getIconUrl(toast.type)" class="icon" alt="icon" />
      <span class="message">{{ toast.message }}</span>
      <span class="close" @click="remove(index)">×</span>
      <div class="progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

type ToastType = 'default' | 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<Toast[]>([]);

export function showToast(message: string, type: ToastType = "default", duration: number = 5000): void {
  toasts.value.push({ message, type, duration });

  setTimeout(() => {
    toasts.value.shift();
  }, duration);
}

export default {
  name: "ToastManager",
  setup() {
    const getIconUrl = (type: ToastType): string => {
      switch (type) {
        case "success":
          return new URL("@/assets/toast_check.png", import.meta.url).href;
        case "error":
          return new URL("@/assets/toast_warning.png", import.meta.url).href;
        case "info":
          return new URL("@/assets/toast_info.png", import.meta.url).href;
        default:
          return new URL("@/assets/toast_bell.png", import.meta.url).href;
      }
    };

    const remove = (index: number): void => {
      toasts.value.splice(index, 1);
    };

    return { toasts, getIconUrl, remove };
  }
};
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 280px;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  color: white;
  background-color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slide-in 0.3s ease-out;
  overflow: hidden;
  user-select: none;
}

.toast .icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.toast .message {
  flex: 1;
  font-size: 1rem;
  line-height: 1.4;
}

.toast .close {
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.6;
  margin-left: 0.5rem;
}
.toast .close:hover {
  opacity: 1;
}

.toast .progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.6);
  width: 100%;
  animation-name: progressbar;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes progressbar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast.success {
  background-color: #2e7d32;
}
.toast.error {
  background-color: #c62828;
}
.toast.info {
  background-color: #1565c0;
}
</style>
