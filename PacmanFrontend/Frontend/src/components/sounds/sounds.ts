import { onMounted } from 'vue';
import { useSoundStore } from '@/piniaStore';

let soundStore: ReturnType<typeof useSoundStore>;

const sounds = {
  eatGhost: new Audio(new URL('@/assets/Sounds/pacman_eatghost.wav', import.meta.url).href),
  death: new Audio(new URL('@/assets/Sounds/pacman_death.wav', import.meta.url).href),
  intro: new Audio(new URL('@/assets/Sounds/pacman_beginning.wav', import.meta.url).href),
  intermission: new Audio(new URL('@/assets/Sounds/pacman_intermission.wav', import.meta.url).href),
  eatPowerpill: new Audio(new URL('@/assets/Sounds/pacman_eatpowerpill.wav', import.meta.url).href),
};

const eatDot0 = new URL('@/assets/Sounds/eat_dot_0.wav', import.meta.url).href;
const eatDot1 = new URL('@/assets/Sounds/eat_dot_1.wav', import.meta.url).href;

let alternate = false;

onMounted(() => {
  soundStore = useSoundStore();
  const volume = soundStore.volume * 0.2;

  for (const sound of Object.values(sounds)) {
    sound.volume = volume;
  }
});

function playSound(name: keyof typeof sounds) {
  if (!soundStore) soundStore = useSoundStore();

  const base = sounds[name];
  if (!base) return;

  const instance = base.cloneNode() as HTMLAudioElement;
  instance.volume = soundStore.volume * 0.2;
  instance.play().catch(() => {});
}

function playChomp() {
  if (!soundStore) soundStore = useSoundStore();

  const dotSound = new Audio(alternate ? eatDot1 : eatDot0);
  dotSound.volume = soundStore.volume * 0.15;
  dotSound.play().catch(() => {});

  alternate = !alternate;
}

export { playSound, playChomp };
