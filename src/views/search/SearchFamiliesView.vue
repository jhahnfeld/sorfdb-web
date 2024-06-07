<script setup lang="ts">
import { type PaginationData } from "@/components/pagination/Pagination";
import type {
  InQuery,
  SearchInfo,
  SortDirection,
  SortOption,
} from "@/model/Search";
import type { ClusterSearchEntry } from "@/model/ClusterSearchResult.ts";
import usePageState, { State } from "@/PageState";
import { useClusterApi as useApi } from "@/SorfdbApi";
import { onMounted, shallowRef } from "vue";
import type { Option } from "@/components/CheckboxOption";
import { ref, type Ref } from "vue";
import { clusterResultTableColums as resultTableColums } from "../browse/ResultColumns";
import ResultsPanel from "@/views/browse/ClusterResultsPanel.vue";
import FamilySelectionPanel from "./FamilySelectionPanel.vue";
import SequenceFamilySelector from "@/components/SequenceFamilySelector.vue";
import { getPsosSorfdbHits } from "@/PsosApi";
import { fastaFromSequences } from "@/fasta-handler";

const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<ClusterSearchEntry[]> = ref([]);
const query: Ref<InQuery> = ref({
  field: "id",
  op: "in",
  value: [],
});

const api = shallowRef(useApi());
const pagination: Ref<PaginationData> = ref({ limit: 10, offset: 0, total: 0 });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const exportInProgress = ref(false);

const allColumns = ref<Option[]>(resultTableColums());
const resultsPanel = ref<typeof ResultsPanel>();

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

function search(offset = 0) {
  searchState.value.setState(State.Loading);
  if (resultsPanel.value) resultsPanel.value.resetTsvExport();
  if (query.value == undefined) return;
  api.value
    .search({
      query: query.value,
      sort: ordering.value,
      offset: offset,
      limit: pagination.value.limit,
    })
    .then((r) => {
      entries.value = r.results;
      searchState.value.setState(State.Main);
      if (r.offset) pagination.value.offset = r.offset;
      pagination.value.total = r.total;
    })
    .catch((err) => pageState.value.setError(err));
}

async function _search(sequences: string[]) {
  searchState.value.setState(State.Loading);
  const hits: string[] = await getPsosSorfdbHits(fastaFromSequences(sequences));

  query.value = {
    field: "id",
    op: "in",
    value: hits,
  };

  search();
}

const searchinfo: Ref<SearchInfo> = ref({ fields: [] });

function updateAllColumns(info: SearchInfo) {
  const index = allColumns.value.reduce(
    (a, v) => {
      a[v.key] = v;
      return a;
    },
    {} as Record<string, Option>,
  );

  for (const f of info.fields) {
    const o = index[f.field];
    if (o) {
      o.sortable = "sortable" in f ? f.sortable : false;
    }
  }
}

function init() {
  pageState.value.setState(State.Loading);
  api.value
    .searchinfo()
    .then((r) => {
      searchinfo.value = r;
      updateAllColumns(r);
      pageState.value.setState(State.Main);
    })
    .catch((err) => pageState.value.setError(err));
}

onMounted(init);
</script>

<template>
  <main class="container pt-5">
    <SequenceFamilySelector name-prefix="search" />
    <FamilySelectionPanel @search="_search" :submitting="searchState.loading" />
    <ResultsPanel
      ref="resultsPanel"
      v-if="query"
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
