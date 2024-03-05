<script setup lang="ts">
import { ref } from 'vue';

// Defines a reactive reference for tracking the menu's open/closed state with an explicit type
const isMenuOpen = ref<boolean>(false);

// Function to toggle the state of 'isMenuOpen'
function toggleMenu(): void {
  console.log('Menu toggled. Current state:', !isMenuOpen.value); // This should log the expected state change
  isMenuOpen.value = !isMenuOpen.value;
}
</script>



<template>
  <nav class="navbar">
    <button @click="toggleMenu" class="menu-icon" aria-label="Toggle navigation menu">
      <!-- SVG for the menu icon -->
      <svg viewBox="0 0 100 80" width="40" height="40" fill="#fff">
        <rect width="100" height="20"></rect>
        <rect y="30" width="100" height="20"></rect>
        <rect y="60" width="100" height="20"></rect>
      </svg>
    </button>
    <h1>Local Needs Databank</h1>
    <ul v-show="isMenuOpen">

      <li><router-link to="/" class="h4 white-80 hover-pink">Home</router-link></li>
      <li><router-link to="/dashboard" class="h4 white-80 hover-pink">Dashboard</router-link></li>
      <li>
        <router-link to="/documentation" class="h4 white-80 hover-pink">Documentation</router-link>
      </li>
    </ul>
  </nav>
</template>


