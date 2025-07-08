<script setup>
import ToastManager from "@/components/devPanel/ToastManager.vue";
import DevPanel from "@/components/devPanel/DevPanel.vue";
</script>

<template>
  <router-view />
  <ToastManager />
  <DevPanel />
</template>

<style scoped></style>
