<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import { computed, type PropType } from "vue";
import type { SortDirection, SortOption } from "@/model/Search";
import SortSymbol from "./SortSymbol.vue";
import { type Option } from "@/components/CheckboxOption";
const props = defineProps({
  entries: {
    type: Array as PropType<SorfdbEntry[]>,
    default: () => [],
  },
  ordering: {
    type: Array as PropType<SortOption[]>,
    default: () => [],
  },
  visibleColumns: {
    type: Array as PropType<Option[]>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:ordering", key: string, direction: SortDirection | null): void;
}>();

// function gc(entry: BakrepSearchResultEntry): string {
//   if (!entry.bakta) return "?";
//   return (entry.bakta.stats.gc * 100).toFixed(2) + " %";
// }

function passOrdering(sortkey: string, newdirection: SortDirection | null) {
  emit("update:ordering", sortkey, newdirection);
}
</script>

<template>
  <table class="mt-3 table table-hover table-striped">
    <thead>
      <tr>
        <th scope="col">
          Id
          <SortSymbol
            :ordering="ordering"
            sortkey="id"
            @update:ordering="passOrdering"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="entry in entries" :key="entry.id">
        <tr>
          <td scope="row">
            <router-link
              :to="{
                name: 'result',
                params: { id: entry.id, tab: 'summary' },
              }"
            >
              {{ entry.id }}
            </router-link>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style>
.pointer {
  cursor: pointer;
}
</style>
@/model/SorfdbSearchResult
