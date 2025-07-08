<template>
  <div class="form-box">
    <h2>Login</h2>
    <form @submit.prevent="handleLoginSubmit">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" class="button">Login</button>
    </form>
    <p>
      Don't have an account yet?
      <a @click="$emit('toggle-form')">Register</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/piniaStore";
import { showToast } from "@/components/devPanel/ToastManager.vue";
import defaultSkinPath from "@/assets/GIFs/pacman.gif";

const email = ref("");
const password = ref("");

const router = useRouter();
const userStore = useUserStore();

const selectedSkinStorage = 'selectedSkin:v2';
const defaultSelectedSkin = defaultSkinPath;

const handleLoginSubmit = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_BASE_URL + `api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(data.message || "Login failed", "error");
      return;
    }

    userStore.setUserId(data.user.id);
    userStore.setUsername(data.user.name);
    localStorage.setItem(selectedSkinStorage, defaultSelectedSkin);
    showToast("Login successful", "success");
    router.push("/");
  } catch (error) {
    console.error("Error:", error);
    showToast("Login failed. Please try again.", "error");
  }
};
</script>

<style scoped>
.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  width: 90%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.button {
  width: 90%;
  padding: 1rem;
  background-color: black;
  color: white;
  font-size: 2rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
}

.button:hover {
  background-color: #222;
}

a {
  color: yellow;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
}
a:hover {
  text-decoration: underline;
}
</style>
