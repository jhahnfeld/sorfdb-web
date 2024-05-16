<script setup lang="ts">
import type { ClusterEntry } from "@/model/ClusterSearchResult.ts";
import type { PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<ClusterEntry>, required: true },
});
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th class="text-end">Number of Sequences:</th>
        <td class="ps-5">
          {{ entry.statistics.sequenceCount }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Average sequence length:</th>
        <td class="ps-5">
          {{ entry.statistics.averageSequenceLength }}
        </td>
      </tr>
      <tr>
        <th class="text-end">Median sequence length:</th>
        <td class="ps-5">
          {{ entry.statistics.medianSequenceLength }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
