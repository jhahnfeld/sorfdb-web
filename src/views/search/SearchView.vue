<script setup lang="ts">
import {
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import type { CompoundQuery, SortDirection, SortOption } from "@/model/Search";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import usePageState from "@/PageState";
import { useApi } from "@/SorfdbApi";
import { shallowRef } from "vue";

import { computed, ref, type Ref } from "vue";
import { type SequenceSearchRequest } from "./SequenceSearchRequest";
import SequenceSelectionPanel from "./SequenceSelectionPanel.vue";
import { resultTableColums } from "../browse/ResultColumns";
import type { Option } from "@/components/CheckboxOption";
import ResultsPanel from "../browse/ResultsPanel.vue";

const searchState = usePageState();
const entries: Ref<SorfdbEntry[]> = ref([]);
const query: Ref<CompoundQuery> = ref({ op: "and", value: [] });

const api = shallowRef(useApi());
const pagination: Ref<PaginationData> = ref({ limit: 10, offset: 0, total: 0 });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const exportInProgress = ref(false);

const allColumns = ref<Option[]>(resultTableColums());

const positionInResults: Ref<PositionInResult> = computed(() =>
  toPosition(pagination.value),
);

function updateOrdering(sortkey: string, direction: SortDirection | null) {
  const idx = ordering.value.findIndex((s) => s.field === sortkey);
  if (direction == null) {
    if (idx > -1) ordering.value.splice(idx, 1);
  } else {
    if (idx > -1) ordering.value[idx].ord = direction;
    else
      ordering.value = [{ field: sortkey, ord: direction }, ...ordering.value];
  }
  search();
}
function search(offset = 0) {}
// function updateOrdering(sortkey: string, direction: SortDirection | null) {
//   const idx = ordering.value.findIndex((s) => s.field === sortkey);
//   if (direction == null) {
//     if (idx > -1) ordering.value.splice(idx, 1);
//   } else {
//     if (idx > -1) ordering.value[idx].ord = direction;
//     else
//       ordering.value = [{ field: sortkey, ord: direction }, ...ordering.value];
//   }
//   filter();
// }

// onMounted(filter);
function _search(req: SequenceSearchRequest) {
  console.log(req);
}
</script>

<template>
  <main class="container pt-5">
    <SequenceSelectionPanel @search="_search" />
    <ResultsPanel
      ref="resultsPanel"
      :api="api"
      :all-columns="allColumns"
      :entries="entries"
      :pagination="pagination"
      :ordering="ordering"
      :query="query"
      :search-state="searchState"
      :export-in-progress="exportInProgress"
      @search="search"
      @update:ordering="updateOrdering"
      @update:exportInProgress="(e) => (exportInProgress = e)"
    />
  </main>
</template>

<style>
label + label {
  margin-left: 10px;
}
</style>
