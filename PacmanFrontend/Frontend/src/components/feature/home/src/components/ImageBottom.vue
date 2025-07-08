<template>
  <div class="bottom-image">
    <img src="@/assets/pacmanwghosts.png" alt="Pac-Man Logo" />
  </div>
</template>


<script lang="ts">
export default {
  name: "ImageBottomComponent",
};
</script>

<style scoped>
.fixed-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  position: relative;
}

.bottom-image {
  position: absolute;
  bottom: 13%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  max-width: 100%;
  height: auto;
}

</style>
