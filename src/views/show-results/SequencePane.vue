<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
type SorfdbSequenceKey = "protein" | "sorf";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
  keyword: { type: String as PropType<SorfdbSequenceKey>, required: true },
});
</script>

<template>
  <div>
    <pre v-if="keyword">
        {{ entry[keyword] }}
    </pre>
  </div>
</template>
