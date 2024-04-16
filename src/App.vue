<script setup lang="ts">
import PageHeader from './components/PageHeader.vue'
import PageFooter from './components/PageFooter.vue'
</script>

<template>
  

  <div class ="tc ">
    <h3 class="tc f2">Welcome to the Local Needs Insight tool</h3>
      
  </div>
  
  <div class="main-container ph3 ph5-l bg-white lh-copy f4 pv0 w-100">

    <router-view></router-view>
  </div>
  <PageFooter></PageFooter>
</template>
