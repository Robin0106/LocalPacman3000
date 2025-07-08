<template>
  <button
    :id="props.id"
    :class="[props.className, { [props.activeClass]: props.isActive }]"
    @click="handleClick"
  >
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ButtonComponent'
});

interface Props {
  label?: string
  className: string
  id?: string
  value?: string
  activeClass?: string
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  activeClass: '',
  isActive: false
});

const emit = defineEmits<{ (e: 'click'): void }>();

function handleClick() {
  emit('click');
}
</script>

<style scoped>

.Select-Button {
  width: 5rem;
  height: 3rem;
  background-color: black;
  color: white;
  font-family: "Jersey 10", serif;
  border: none;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  font-size: 1.7rem;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  transform-origin: center;
}

.Select-Button:not(.selectedButton):hover {
  transform: scale(1.02);
  font-size: 1.8rem;
  background-color: #222;
}

.selectedButton {
  width: 5rem;
  height: 3rem;
  background-color: #222;
  color: yellow;
  font-family: "Jersey 10", serif;
  border: none;
  border-radius: 1rem;
  font-size: 1.7rem;
  font-weight: bold;
  transform-origin: center;
  transition: all 0.2s ease-in-out;
  cursor: default;
}

</style>
