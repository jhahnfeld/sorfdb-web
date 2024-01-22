<script setup lang="ts">
import { type PaginationData } from "@/components/pagination/Pagination";
import type {
  InQuery,
  SearchInfo,
  SortDirection,
  SortOption,
} from "@/model/Search";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import usePageState, { State } from "@/PageState";
import { useApi } from "@/SorfdbApi";
import { onMounted, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Option } from "@/components/CheckboxOption";
import { ref, type Ref, watch } from "vue";
import { resultTableColums } from "../browse/ResultColumns";
import ResultsPanel from "../browse/ResultsPanel.vue";
import { type SequenceSearchRequest } from "./SequenceSearchRequest";
import SequenceSelectionPanel from "./SequenceSelectionPanel.vue";

const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<SorfdbEntry[]> = ref([]);
const query: Ref<InQuery | undefined> = ref();

const api = shallowRef(useApi());
const route = useRoute();
const router = useRouter();
const pagination: Ref<PaginationData> = ref({ limit: 10, offset: 0, total: 0 });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const exportInProgress = ref(false);

const allColumns = ref<Option[]>(resultTableColums());
const resultsPanel = ref<typeof ResultsPanel>();

function encodeQuery(): string {
  return btoa(JSON.stringify({ query: query.value, ordering: ordering.value }));
}

function decodeQuery(encodedQuery: string): {
  query: InQuery;
  ordering: SortOption[];
} {
  return JSON.parse(atob(encodedQuery));
}

function populateVariables() {
  if (route.query.query) {
    const decodedQuery = decodeQuery(route.query.query as string);
    query.value = decodedQuery.query;
    ordering.value = decodedQuery.ordering;
    pagination.value.offset = Number.parseInt(route.query.offset as string);
    pagination.value.limit = Number.parseInt(route.query.limit as string);
    search(pagination.value.offset);
  }
}

watch(
  () => route.query,
  () => {
    populateVariables();
  },
);

function updateQuery(offset = 0) {
  router.push({
    name: "search",
    query: {
      offset: offset,
      limit: pagination.value.limit,
      query: encodeQuery(),
    },
  });
}

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
      updateQuery(r.offset);
    })
    .catch((err) => pageState.value.setError(err));
}

function _search(req: SequenceSearchRequest) {
  if (req.type === "protein" && req.mode === "exact") {
    query.value = {
      field: "protein",
      op: "in",
      value: req.sequences,
    };
  } else if (req.type === "dna" && req.mode === "exact") {
    query.value = {
      field: "sorf",
      op: "in",
      value: req.sequences,
    };
  } else if (req.type === "id") {
    query.value = {
      field: "id",
      op: "in",
      value: req.ids,
    };
  }
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
    .then(populateVariables)
    .catch((err) => pageState.value.setError(err));
}
onMounted(init);
</script>

<template>
  <main class="container pt-5">
    <SequenceSelectionPanel
      @search="_search"
      :submitting="searchState.loading"
    />
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
      @search="updateQuery"
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
