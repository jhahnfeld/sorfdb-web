<script setup lang="ts">
import usePageState, { State } from "@/PageState";
import { useApi } from "@/SorfdbApi";
import { type Option } from "@/components/CheckboxOption";
import Loading from "@/components/Loading.vue";
import { type PaginationData } from "@/components/pagination/Pagination";
import QueryBuilder from "@/components/querybuilder/QueryBuilder.vue";
import type {
  LeafRule,
  NestedRule,
  Rule,
} from "@/components/querybuilder/Rule";
import type {
  CompoundQuery,
  SearchInfo,
  SearchInfoField,
  SortDirection,
  SortOption,
} from "@/model/Search";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import {
  computed,
  onMounted,
  ref,
  unref,
  type Ref,
  shallowRef,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { resultTableColums } from "./ResultColumns";
import ResultsPanel from "./ResultsPanel.vue";

const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<SorfdbEntry[]> = ref([]);

const api = shallowRef(useApi());
const route = useRoute();
const router = useRouter();
const pagination: Ref<PaginationData> = ref({ limit: 10, offset: 0, total: 0 });
const query: Ref<CompoundQuery> = ref({ op: "and", value: [] });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const searchinfo: Ref<SearchInfo> = ref({ fields: [] });
const exportInProgress = ref(false);

const allColumns = ref<Option[]>(resultTableColums());

export type Range = {
  from: number;
  to: number;
};

function encodeQuery(): string {
  return btoa(JSON.stringify({ query: query.value, ordering: ordering.value }));
}
function decodeQuery(encodedQuery: string): {
  query: CompoundQuery;
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
    name: "browse",
    query: {
      offset: offset,
      limit: pagination.value.limit,
      query: encodeQuery(),
    },
  });
}

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

type FieldConfiguration = {
  label: string;
  group: string;
};

function fc(label: string, group: string): FieldConfiguration {
  return {
    label: label,
    group: group,
  };
}

const fieldNames = computed(() => {
  const out: Record<string, FieldConfiguration> = {};
  for (const col of allColumns.value) {
    out[col.key] = fc(col.label, col.group);
  }
  return out;
});

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

function searchinfo2querybuilderrules(f: SearchInfoField): Rule {
  const config = fieldNames.value[f.field];
  const field = config ? config.label : f.field;
  const group = config ? config.group : "";

  if (f.type === "nested") {
    const nestedRule: NestedRule = {
      group: group.replace("&nbsp;", " "),
      field: f.field,
      label: field,
      type: "nested",
      rules: f.fields.map(searchinfo2querybuilderrules),
    };
    return nestedRule;
  } else {
    const leafRule: LeafRule = {
      group: group.replace("&nbsp;", " "),
      field: f.field,
      label: field,
      type: f.type as "number" | "text",
      ops: f.ops.map((o) => ({ label: o, description: o })),
    };
    return leafRule;
  }
}

const rules: Ref<Rule[]> = computed(() => {
  let out: Rule[] = [];
  out = searchinfo.value.fields.map(searchinfo2querybuilderrules);
  return out;
});

function search(offset = 0) {
  searchState.value.setState(State.Loading);
  if (resultsPanel.value) resultsPanel.value.resetTsvExport();
  api.value
    .search({
      query: unref(query),
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

const resultsPanel = ref<typeof ResultsPanel>();

onMounted(init);
</script>

<template>
  <main class="container pt-5">
    <Loading :state="pageState">
      <div class="row">
        <h2>Browse</h2>
        <div class="col-12">
          <QueryBuilder v-model:query="query" :rules="rules" @submit="search" />
        </div>
      </div>
      <div class="col-12">
        <div class="d-flex mt-2 mb-5 justify-content-end">
          <button
            @click="search(0)"
            class="btn btn-primary"
            type="button"
            id="button-search"
            :disabled="exportInProgress"
          >
            Search
          </button>
        </div>
      </div>
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
        @search="updateQuery"
        @update:ordering="updateOrdering"
        @update:exportInProgress="(e) => (exportInProgress = e)"
      />
    </Loading>
  </main>
</template>

<style></style>
