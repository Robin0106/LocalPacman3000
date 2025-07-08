  <template>
  <div ref="container" class="profile-picture">
    <span v-if="username" class="username">{{ username }}</span>
    <button class="profile-button" @click="togglePopup">
      <img src="@/assets/profile.png" alt="Profilbild" />
    </button>
    <div v-if="showPopup" class="profile-popup">
      <p v-if="!username">Don't have an account yet?</p>
      <router-link v-if="!username" to="/login" class="popup-link">
        Login
      </router-link>
      <div v-else>
        <p>Logged in as {{ username }}</p>
        <a class="popup-link" @click.prevent="logout">Logout</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/piniaStore';
import { showToast } from '@/components/devPanel/ToastManager.vue';
import defaultSkinPath from "@/assets/GIFs/pacman.gif";

const showPopup = ref(false);
const username = ref<string | null>(null);
const container = ref<HTMLElement | null>(null);

const userStore = useUserStore();
const playerId = userStore.userId;

const togglePopup = () => {
  showPopup.value = !showPopup.value;
};

const selectedSkinStorage = 'selectedSkin:v2';
const defaultSelectedSkin = defaultSkinPath;

const logout = async () => {
  try {
    const res = await fetch(import.meta.env.VITE_BASE_URL + `api/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerID: playerId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    userStore.logout();
    localStorage.setItem(selectedSkinStorage, defaultSelectedSkin);
    username.value = null;
    showPopup.value = false;
    showToast('Successfully logged out', 'info');
  } catch (err) {
    console.error('Error during logout:', err);
    showToast('Error during logout', 'error');
  }
};


const fetchUsername = async () => {
  if (!playerId) return;
  try {
    const res = await fetch(
      import.meta.env.VITE_BASE_URL + `api/profile?playerID=${playerId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    username.value = data.username;
  } catch (err) {
    console.error('Error while fetching username:', err);
  }
};

const handleClickOutside = (ev: MouseEvent) => {
  if (
    showPopup.value &&
    container.value &&
    !container.value.contains(ev.target as Node)
  ) {
    showPopup.value = false;
  }
};

onMounted(() => {
  fetchUsername();
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.profile-picture {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.username {
  font-size: 2rem;
  color: white;
  white-space: nowrap;
  direction: rtl;
  text-align: right;
  max-width: 15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-button {
  background: none;
  border: none;
  cursor: pointer;
}
.profile-button img {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease-in-out;
}
.profile-button img:hover {
  transform: scale(1.1);
}
.profile-popup {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #183446;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  text-align: center;
}
.profile-popup p {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
}
.popup-link {
  color: yellow;
  text-decoration: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.popup-link:hover {
  text-decoration: underline;
}
</style>
