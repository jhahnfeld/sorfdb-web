<script setup lang="ts">
import { type Option } from "@/components/CheckboxOption";
import type { SortDirection, SortOption } from "@/model/Search";
import { type PfamEntry, type SorfdbEntry } from "@/model/SorfdbSearchResult";
import { type PropType } from "vue";
import SortSymbol from "./SortSymbol.vue";
import { round } from "@/util";
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

function passOrdering(sortkey: string, newdirection: SortDirection | null) {
  emit("update:ordering", sortkey, newdirection);
}

function extractValue(entry: SorfdbEntry, c: Option) {
  const tmp = entry as Record<string, unknown>;
  const val = tmp[c.key];
  if (c.key == "rbs") {
    if (val != 0 && val != 1) {
      return "?";
    }
  } else if (!val) {
    return "?";
  } else if (c.key == "pfam-hits") {
    if ((val as PfamEntry).length == 0) {
      return "-";
    } else {
      return constructPfamEntries(val as PfamEntry);
    }
  }
  return val;
}

function constructPfamEntries(entry: PfamEntry) {
  const entryParts: String[] = [];
  for (let e of entry) {
    if (entryParts.length > 0) {
      entryParts.push("\n");
    }
    let evalueAsString: string = e.evalue.toString();
    if (evalueAsString.includes("e")) {
      let evalueSplitted: string[] = evalueAsString.split("e");
      let significand: string = round(
        parseFloat(evalueSplitted[0]),
        2,
      ).toString();
      let exponent: string = evalueSplitted[1];
      entryParts.push(e.name + ": " + significand + "e" + exponent);
    } else {
      entryParts.push(e.name + ": " + e.evalue);
    }
  }
  return entryParts.join("");
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
