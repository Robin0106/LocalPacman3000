<template>


  <header class="title">
    <h1>PACMAN</h1>
  </header>
</template>

<script lang="ts">
export default {
  name: "HeaderComponent",
};
</script>

<style scoped>
.title {
  color: yellow;
  font-size: 6rem;
  text-align: center;
  position: absolute;
  top: -3%;
  left: 50%;
  transform: translateX(-50%);
}

</style>
