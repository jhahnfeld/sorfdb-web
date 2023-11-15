<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Family</th>
        <th scope="col">E-vlaue</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="hit in entry['pfam-hits']" :key="hit.name">
        <tr scope="row">
          <td>
            {{ hit.name }}
          </td>
          <td>
            {{ hit.evalue }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
