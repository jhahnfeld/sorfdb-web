<template>
  <div class="dropdown px-2">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      data-bs-auto-close="outside"
    >
      {{ title }}
    </button>
    <div class="dropdown-menu">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  title: { type: String as PropType<string>, default: "" },
});
</script>
