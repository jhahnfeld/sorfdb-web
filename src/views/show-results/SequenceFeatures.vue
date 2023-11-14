<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});

function hasRbs(rbs: number): string {
  if (rbs == 0) {
    return "No" + rbs;
  } else if (rbs == 1) {
    return "Yes";
  } else {
    return "?";
  }
}
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th class="text-end">sORFdb length:</th>
        <td class="ps-5">{{ entry.slen }}</td>
      </tr>
      <tr>
        <th class="text-end">Protein length:</th>
        <td class="ps-5">{{ entry.plen }}</td>
      </tr>
      <tr>
        <th class="text-end">Start-codon:</th>
        <td class="ps-5">{{ entry["start-codon"] }}</td>
      </tr>
      <tr>
        <th class="text-end">Product:</th>
        <td class="ps-5">{{ entry.product }}</td>
      </tr>
      <tr>
        <th class="text-end">Ribosomal binding site:</th>
        <td class="ps-5">{{ entry.rbs == 1 ? "Yes" : "No" }}</td>
      </tr>
    </tbody>
  </table>
</template>
