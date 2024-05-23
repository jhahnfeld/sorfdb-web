<script setup lang="ts">
import type { ClusterEntry } from "@/model/ClusterSearchResult.ts";
import { extractSequencesFromFasta, fastaFromSequences } from "@/fasta-handler";
import { computed, type PropType } from "vue";

const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<ClusterEntry>, required: true },
});

const alignment = computed(() =>
  fastaFromSequences(
    extractSequencesFromFasta(props.entry.alignment, Infinity),
  ),
);
</script>

<template>
  <div>
    <pre>{{ alignment }}</pre>
  </div>
</template>
