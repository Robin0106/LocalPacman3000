<template>
  <div class="background-layer"></div>
  <div id="scaler">
    <div class="login-page">
      <Header />
      <Home />
      <div class="form-container">
        <LoginForm v-if="showLogin" @toggle-form="toggleForm" />
        <RegisterForm
          v-else
          @toggle-form="toggleForm"
          @password-mismatch="showPasswordPopup"
        />
      </div>
      <div class="popup" v-if="showPopup">
        <p>Passwords do not match.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Header from "@/components/feature/login/src/components/Header.vue";
import Home from "@/components/feature/login/src/components/Home.vue";
import LoginForm from "@/components/feature/login/src/components/loginform.vue";
import RegisterForm from "@/components/feature/login/src/components/registerform.vue";

export default {
  name: "LoginPage",
  components: {
    Header,
    Home,
    LoginForm,
    RegisterForm,
  },
  setup() {
    const showLogin = ref(true);
    const showPopup = ref(false);

    const toggleForm = () => {
      showLogin.value = !showLogin.value;
    };

    const showPasswordPopup = () => {
      showPopup.value = true;
      setTimeout(() => {
        showPopup.value = false;
      }, 3000);
    };

    const updateScale = () => {
      const baseWidth = 1920;
      const baseHeight = 995;
      const scaleX = window.innerWidth / baseWidth;
      const scaleY = window.innerHeight / baseHeight;
      const scale = Math.min(scaleX, scaleY);

      const scaler = document.getElementById("scaler");
      if (scaler) {
        scaler.style.transform = `scale(${scale})`;
        scaler.style.transformOrigin = "top left";

        const offsetX = (window.innerWidth - baseWidth * scale) / 2;
        const offsetY = (window.innerHeight - baseHeight * scale) / 2;

        scaler.style.position = "absolute";
        scaler.style.left = `${offsetX}px`;
        scaler.style.top = `${offsetY}px`;
      }
    };

    onMounted(() => {
      updateScale();
      window.addEventListener("resize", updateScale);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateScale);
    });

    return { showLogin, toggleForm, showPopup, showPasswordPopup };
  },
};
</script>

<style scoped>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #162034;
  z-index: -1;
}

#scaler {
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  position: absolute;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.login-page {
  background-color: #162034;
  font-family: "Jersey 10", serif;
  overflow: hidden;
  user-select: none;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.form-container {
  background-color: #183446;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 28rem;
  position: fixed;
  top: 18rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup {
  position: fixed;
  top: 57%;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  animation: popupAnimation 3s forwards;
}

@keyframes popupAnimation {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  16.66% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  83.33% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}
</style>
