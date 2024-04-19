<script setup lang="ts">
import { type Option } from "@/components/CheckboxOption";
import type { SortDirection, SortOption } from "@/model/Search";
import { type ClusterSearchEntry } from "@/model/ClusterSearchResult";
import { type PropType } from "vue";
import SortSymbol from "./SortSymbol.vue";
const props = defineProps({
  entries: {
    type: Array as PropType<ClusterSearchEntry[]>,
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

function passOrdering(sortkey: string, newdirection: SortDirection | null) {
  emit("update:ordering", sortkey, newdirection);
}

function extractValue(entry: ClusterSearchEntry, c: Option) {
  const tmp = entry as Record<
    string,
    string | number | Record<string, unknown>
  >;
  let val = tmp[c.key];
  if (c.key.startsWith("statistics")) {
    const splitKey: string = c.key.split(".")[1];
    const tmp2 = tmp["statistics"] as Record<string, number>;
    val = tmp2[splitKey];
  }
  return val;
}
</script>

<template>
  <table class="mt-3 table table-hover table-striped">
    <thead>
      <tr>
        <th
          class="align-top"
          v-for="c of visibleColumns"
          :key="c.key"
          scope="row"
        >
          {{ c.label }}
          <SortSymbol
            v-if="c.sortable"
            :sortkey="c.key"
            :ordering="ordering"
            @update:ordering="passOrdering"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="entry in entries" :key="entry.id">
        <tr>
          <td v-for="c of visibleColumns" :key="c.key" scope="row">
            <template v-if="c.link">
              <router-link :to="{ name: 'result', params: { id: entry.id } }">
                {{ extractValue(entry, c) }}
              </router-link>
            </template>
            <template v-else>
              {{ extractValue(entry, c) }}
            </template>
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
