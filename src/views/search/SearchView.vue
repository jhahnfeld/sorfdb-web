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
import type { Option } from "@/components/CheckboxOption";
import router from "@/router";
import { useRoute } from "vue-router";
import { computed, ref, type Ref } from "vue";
import { resultTableColums } from "../browse/ResultColumns";
import ResultsPanel from "../browse/ResultsPanel.vue";
import { type SequenceSearchRequest } from "./SequenceSearchRequest";
import SequenceSelectionPanel from "./SequenceSelectionPanel.vue";

const route = useRoute();
const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<SorfdbEntry[]> = ref([]);
const query: Ref<InQuery | undefined> = ref();

const api = shallowRef(useApi());
const pagination: Ref<PaginationData> = ref({ limit: 10, offset: 0, total: 0 });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const exportInProgress = ref(false);

const allColumns = ref<Option[]>(resultTableColums());
const resultsPanel = ref<typeof ResultsPanel>();

export type Tab = { id: string; name: string };

const tabs: Tab[] = [
  { id: "sequence", name: "Sequences" },
  { id: "family", name: "Families" },
];

const active_tab: Ref<string> = computed(() =>
  route.params.tab ? (route.params.tab as string) : "sequence",
);

function updateTab(newTab: string) {
  router.push({ name: "search-tab", params: { tab: newTab } });
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
    .catch((err) => pageState.value.setError(err));
}

onMounted(init);
</script>

<template>
  <main class="container pt-5">
    <div class="mx-3">
      <ul class="nav nav-pills py-3">
        <li class="nav-item" v-for="item in tabs" :key="item.id">
          <button
            class="nav-link"
            :class="{ active: active_tab === item.id }"
            @click="updateTab(item.id)"
          >
            <h3>{{ item.name }}</h3>
          </button>
        </li>
      </ul>
    </div>

    <template v-if="active_tab === 'sequence'">
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
        @search="search"
        @update:ordering="updateOrdering"
        @update:exportInProgress="(e) => (exportInProgress = e)"
      />
    </template>
    <template v-if="active_tab === 'family'">
      <h2>WIP</h2>
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
    </template>
  </main>
</template>

<style>
label + label {
  margin-left: 10px;
}
</style>
