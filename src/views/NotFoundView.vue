<template>
  <div class="container">
    <div class="container-fluid">
      <div class="alert alert-danger">
        <h5>Page not found: {{ $route.fullPath }}</h5>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
export default {
  name: "Lost",
};
</script>