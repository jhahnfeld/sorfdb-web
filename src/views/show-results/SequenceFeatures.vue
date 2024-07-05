<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});

function hasStartCodon(codon: string): string {
  if (codon == "") {
    return "?";
  } else {
    return codon;
  }
}

function hasRbs(rbs: number | null): string {
  if (rbs == 0) {
    return "No";
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
        <th class="text-end">sORF length:</th>
        <td class="ps-5">{{ entry.slen }}</td>
      </tr>
      <tr>
        <th class="text-end">Protein length:</th>
        <td class="ps-5">{{ entry.plen }}</td>
      </tr>
      <tr>
        <th class="text-end">Start-codon:</th>
        <td class="ps-5">{{ hasStartCodon(entry["start-codon"]) }}</td>
      </tr>
      <tr>
        <th class="text-end">Product:</th>
        <td class="ps-5">{{ entry.product }}</td>
      </tr>
      <tr>
        <th class="text-end">Ribosomal binding site:</th>
        <td class="ps-5">{{ hasRbs(entry.rbs) }}</td>
      </tr>
    </tbody>
  </table>
</template>
