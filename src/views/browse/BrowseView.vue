<script setup lang="ts">
import { useApi } from "@/SorfdbApi";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import {
  empty,
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import QueryBuilder from "@/components/querybuilder/QueryBuilder.vue";
import type {
  LeafRule,
  NestedRule,
  Rule,
} from "@/components/querybuilder/Rule";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type {
  CompoundQuery,
  SearchInfo,
  SearchInfoField,
  SortDirection,
  SortOption,
} from "@/model/Search";
import { saveAs } from "file-saver";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  type Ref,
} from "vue";
import ExportProgress from "./ExportProgress.vue";
import { downloadFullTsv, type ProgressEvent } from "./ExportTsv";
import ResultTable from "./ResultTable.vue";
import { type Option } from "@/components/CheckboxOption";
import CheckboxSelection from "@/components/CheckboxSelectionWithVModel.vue";
import CheckboxDropdown from "@/components/DropdownCheckbox.vue";
import { a } from "node_modules/@storybook/vue3/dist/render-ddbe18a8";

const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<SorfdbEntry[]> = ref([]);

const api = useApi();
const pagination: Ref<PaginationData> = ref({ limit: 10, offset: 0, total: 0 });
const query: Ref<CompoundQuery> = ref({ op: "and", value: [] });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const searchinfo: Ref<SearchInfo> = ref({ fields: [] });

const allColumns = ref<Option[]>([
  { group: "General", label: "sORF ID", key: "id", link: true },
  { group: "General", label: "Source database", key: "source" },
  { group: "General", label: "GenBank Assembly", key: "assembly" },
  { group: "General", label: "GenBank/SmProt Accession", key: "accession" },
  { group: "General", label: "GenBank/SmProt Protein ID", key: "protein-id" },
  { group: "General", label: "UniProtKB/Swiss-Prot UID", key: "uid" },
  {
    group: "General",
    label: "UniProtKB/Swiss-Prot entry name",
    key: "entry-name",
  },
  { group: "Taxonomy", label: "Phylum", key: "phylum" },
  { group: "Taxonomy", label: "Class", key: "class" },
  { group: "Taxonomy", label: "Order", key: "order" },
  { group: "Taxonomy", label: "Family", key: "family" },
  { group: "Taxonomy", label: "Genus", key: "genus" },
  { group: "Taxonomy", label: "Species", key: "species" },
  { group: "Taxonomy", label: "Strain", key: "strain" },
  { group: "Sequence&nbsp;features", label: "sORF", key: "sorf" },
  { group: "Sequence&nbsp;features", label: "sORF length", key: "slen" },
  { group: "Sequence&nbsp;features", label: "Start codon", key: "start-codon" },
  { group: "Sequence&nbsp;features", label: "Protein", key: "protein" },
  { group: "Sequence&nbsp;features", label: "Protein length", key: "plen" },
  { group: "Sequence&nbsp;features", label: "Product", key: "product" },
  {
    group: "Sequence&nbsp;features",
    label: "Ribosomal binding site",
    key: "rbs",
  },
  { group: "Protein&nbsp;descriptors", label: "Pfam hits", key: "pfam-hits" },
  { group: "Protein&nbsp;descriptors", label: "Gravy", key: "gravy" },
  {
    group: "Protein&nbsp;descriptors",
    label: "Aromaticity",
    key: "aromaticity",
  },
  {
    group: "Protein&nbsp;descriptors",
    label: "Molecular weight",
    key: "molecular-weight",
  },
  {
    group: "Protein&nbsp;descriptors",
    label: "Instability",
    key: "instability",
  },
  {
    group: "Protein&nbsp;descriptors",
    label: "Isoelectric point",
    key: "isoelectric-point",
  },
  {
    group: "Protein&nbsp;descriptors",
    label: "Aliphatic-index",
    key: "aliphatic-index",
  },
  { group: "Protein&nbsp;descriptors", label: "Boman", key: "boman" },
]);

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

const fieldNames = computed(() => {
  const out: Record<string, string> = {};
  for (const col of allColumns.value) {
    out[col.key] = col.label;
  }
  return out;
});

const defaultColumns = [
  "id",
  "species",
  "slen",
  "start-codon",
  "plen",
  "product",
  "rbs",
  "pfam-hits",
  "gravy",
  "aromaticity",
  "molecular-weight",
  "instability",
  "isoelectric-point",
  "aliphatic-index",
  "boman",
];

const selectedColumns = ref<string[]>([...defaultColumns]);
const visibleColumns = computed(() => {
  return allColumns.value.filter((c) =>
    selectedColumns.value.some((s) => s == c.key),
  );
});
const groupedColumns = computed(() => {
  const groups: Record<string, Option[]> = {};
  for (const c of allColumns.value) {
    if (!(c.group in groups)) {
      groups[c.group] = [];
    }
    groups[c.group].push(c);
  }
  return Object.entries(groups);
});

function updateVisibleColumns(selection: Option[]) {
  selectedColumns.value = selection.map((x) => x.key);
}

function init() {
  pageState.value.setState(State.Loading);
  api
    .searchinfo()
    .then((r) => {
      searchinfo.value = r;
      updateAllColumns(r);
      pageState.value.setState(State.Main);
    })
    .catch((err) => pageState.value.setError(err));
}

function searchinfo2querybuilderrules(f: SearchInfoField): Rule {
  const label =
    f.field in fieldNames.value ? fieldNames.value[f.field] : f.field;
  if (f.type === "nested") {
    const nestedRule: NestedRule = {
      field: f.field,
      label: label,
      type: "nested",
      rules: f.fields.map(searchinfo2querybuilderrules),
    };
    return nestedRule;
  } else {
    const leafRule: LeafRule = {
      field: f.field,
      label: label,
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
  resetTsvExport();
  api
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
    })
    .catch((err) => pageState.value.setError(err));
}

function clearSelection() {
  selectedColumns.value = [];
}

function resetSelection() {
  selectedColumns.value = [...defaultColumns];
}

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

let cancelExport: AbortController | undefined = undefined;
const progress = ref<ProgressEvent>();
const exportError = ref<string>();
const exportInProgress = ref(false);
function exportTsv() {
  exportError.value = undefined;
  exportInProgress.value = true;
  progress.value = { total: pagination.value.total, count: 0, progress: 0 };
  cancelExport = downloadFullTsv(
    api,
    {
      query: query.value,
      sort: [{ field: "id", ord: "asc" }],
    },
    {
      onError: (e) => {
        exportError.value = e as string;
        exportInProgress.value = false;
      },
      onFinished: (d) => {
        const blob = new Blob([d], {
          type: "text/tab-separated-values;charset=utf-8",
        });
        saveAs(blob, "bakrep-export.tsv");
        exportInProgress.value = false;
        cancelExport = undefined;
      },
      onProgress: (p) => (progress.value = p),
    },
  );
}
function resetTsvExport() {
  progress.value = undefined;
  exportError.value = undefined;
  exportInProgress.value = false;
}

onMounted(init);
onBeforeUnmount(() => {
  if (cancelExport) cancelExport.abort();
});
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

      <div class="row">
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

        <div class="btn-group">
          <CheckboxDropdown title="Select visible columns">
            <div class="d-flex">
              <div class="mx-4" v-for="g in groupedColumns" :key="g[0]">
                <h5 v-html="g[0]"></h5>
                <CheckboxSelection
                  :model-value="visibleColumns"
                  @update:modelValue="updateVisibleColumns"
                  :options="g[1]"
                />
              </div>
            </div>
          </CheckboxDropdown>

          <div class="px-2">
            <button
              @click="clearSelection()"
              class="btn btn-secondary"
              type="button"
              id="button-search"
            >
              Clear selected columns
            </button>
          </div>
          <div class="px-2">
            <button
              @click="resetSelection()"
              class="btn btn-secondary"
              type="button"
              id="button-search"
            >
              Reset columns to default
            </button>
          </div>
        </div>
      </div>
      <Loading :state="searchState">
        <div class="row">
          <div class="col-12 d-flex justify-content-between align-items-end">
            <div class="fs-tiny">
              Showing search results {{ positionInResults.firstElement }}-{{
                positionInResults.lastElement
              }}
              of {{ pagination.total }} results
            </div>
            <div v-if="pagination.total > 0">
              <button
                class="btn btn-sm btn-link link-secondary"
                @click="exportTsv"
                :disabled="exportInProgress"
              >
                Export as tsv
              </button>
            </div>
          </div>
          <div class="col-12">
            <ExportProgress
              v-if="progress"
              :progress="progress"
              :error="exportError"
            />
          </div>
          <div class="col-12 overflow-x-auto">
            <ResultTable
              :ordering="ordering"
              :entries="entries"
              @update:ordering="updateOrdering"
              :visible-columns="visibleColumns"
            />
          </div>
          <Pagination
            v-if="pagination.total > 0"
            class="mt-3"
            :value="pagination"
            @update:offset="search"
          />
        </div>
      </Loading>
    </Loading>
  </main>
</template>

<style></style>
@/SorfdbApi @/model/SorfdbSearchResult
