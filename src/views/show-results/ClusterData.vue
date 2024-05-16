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
        <th class="text-end">Family ID:</th>
        <td class="ps-5">{{ entry.id }}</td>
      </tr>
      <tr>
        <th class="text-end">Function:</th>
        <td class="ps-5">
          {{ entry.function }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
