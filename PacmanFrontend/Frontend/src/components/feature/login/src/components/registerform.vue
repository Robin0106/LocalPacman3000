<template>
  <div class="form-box">
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        required
      />
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
      <input
        v-model="passwordRepeat"
        type="password"
        placeholder="Repeat password"
        required
      />
      <button type="submit" class="button">Register</button>
    </form>

    <p>
      Already have an account?
      <a @click="$emit('toggle-form')">Login</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "@/components/devPanel/ToastManager.vue";
import { useUserStore } from "@/piniaStore";

const username = ref("");
const email = ref("");
const password = ref("");
const passwordRepeat = ref("");

const router = useRouter();
const userStore = useUserStore();

const isTooShort = (name: string) => name.length < 3;
const isTooLong = (name: string) => name.length > 14;
const hasInvalidChars = (name: string) => !/^[a-zA-Z0-9_]*$/.test(name);

const registerUser = async () => {
  const name = username.value;

  if (isTooShort(name)) {
    showToast("Username is too short (min. 3 characters)", "error");
    return;
  }

  if (isTooLong(name)) {
    showToast("Username is too long (max. 14 characters)", "error");
    return;
  }

  if (hasInvalidChars(name)) {
    showToast("Username contains invalid characters (only a–z, A–Z, 0–9, _ allowed)", "error");
    return;
  }

  if (password.value.includes(" ")) {
    showToast("Password must not contain spaces", "error");
    return;
  }

  if (password.value !== passwordRepeat.value) {
    showToast("Passwords do not match", "error");
    return;
  }

  try {
    const response = await fetch(import.meta.env.VITE_BASE_URL + 'api/register', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(data.message || "Registration failed", "error");
      return;
    }

    showToast("Registration successful", "success");
    userStore.setUserId(data.user.id);
    router.push("/");
  } catch (err) {
    console.error(err);
    showToast("Registration failed", "error");
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
