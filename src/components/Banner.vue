<template>
  <div class="banner">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Hello World'
})
</script>

<style scoped>
.banner {
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.banner h1 {
  font-size: 2em;
  margin: 0;
}
</style> 