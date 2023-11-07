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

const pageState = usePageState();
const searchState = usePageState();
const entries: Ref<SorfdbEntry[]> = ref([]);

const api = useApi();
const pagination: Ref<PaginationData> = ref(empty());
const query: Ref<CompoundQuery> = ref({ op: "and", value: [] });
const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);
const searchinfo: Ref<SearchInfo> = ref({ fields: [] });

const selectedColumns = ref<Option[]>([
  { label: "sORF ID", key: "id", link: true },
  { label: "Species", key: "species" },
  { label: "sORF length", key: "slen" },
  { label: "Start codon", key: "start-codon" },
  { label: "Protein length", key: "plen" },
  { label: "Product", key: "product" },
  { label: "Ribosomal binding site", key: "rbs" },
  { label: "Pfam hits", key: "pfam-hits" },
  { label: "Gravy", key: "gravy" },
  { label: "Aromaticity", key: "aromaticity" },
  { label: "Molecular weight", key: "molecular-weight" },
  { label: "Instability", key: "instability" },
  { label: "Isoelectric point", key: "isoelectric-point" },
  { label: "Aliphatic-index", key: "aliphatic-index" },
  { label: "Boman", key: "boman" },
]);
const defaultSelectedColumns: Option[] = selectedColumns.value;
const columnIDs: Option[] = [
  { label: "sORF ID", key: "id" },
  { label: "Source database", key: "source" },
  { label: "GenBank Assembly", key: "assembly" },
  { label: "GenBank/SmProt Accession", key: "accession" },
  { label: "GenBank/SmProt Protein ID", key: "protein-id" },
  { label: "UniProtKB/Swiss-Prot UID", key: "uid" },
  { label: "UniProtKB/Swiss-Prot entry name", key: "entry-name" },
];
const columnTaxonomy: Option[] = [
  { label: "Phylum", key: "phylum" },
  { label: "Class", key: "class" },
  { label: "Order", key: "order" },
  { label: "Family", key: "family" },
  { label: "Genus", key: "genus" },
  { label: "Species", key: "species" },
  { label: "Strain", key: "strain" },
];
const columnSequenceFeatures: Option[] = [
  { label: "sORF", key: "sorf" },
  { label: "sORF length", key: "slen" },
  { label: "Start codon", key: "start-codon" },
  { label: "Protein", key: "protein" },
  { label: "Protein length", key: "plen" },
  { label: "Product", key: "product" },
  { label: "Ribosomal binding site", key: "rbs" },
];
const columnDescriptors: Option[] = [
  { label: "Pfam hits", key: "pfam-hits" },
  { label: "Gravy", key: "gravy" },
  { label: "Aromaticity", key: "aromaticity" },
  { label: "Molecular weight", key: "molecular-weight" },
  { label: "Instability", key: "instability" },
  { label: "Isoelectric point", key: "isoelectric-point" },
  { label: "Aliphatic-index", key: "aliphatic-index" },
  { label: "Boman", key: "boman" },
];

function init() {
  pageState.value.setState(State.Loading);
  api
    .searchinfo()
    .then((r) => {
      searchinfo.value = r;
      pageState.value.setState(State.Main);
    })
    .catch((err) => pageState.value.setError(err));
}

function searchinfo2querybuilderrules(f: SearchInfoField): Rule {
  if (f.type === "nested") {
    const nestedRule: NestedRule = {
      field: f.field,
      label: f.field in fieldNames ? fieldNames[f.field] : f.field,
      type: "nested",
      rules: f.fields.map(searchinfo2querybuilderrules),
    };
    return nestedRule;
  } else {
    const leafRule: LeafRule = {
      field: f.field,
      label: f.field in fieldNames ? fieldNames[f.field] : f.field,
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

const fieldNames: Record<string, string> = {
  id: "sORF ID",
  source: "Source database",
  assembly: "GenBank Assembly",
  accession: "GenBank/SmProt Accession",
  "protein-id": "GenBank/SmProt Protein ID",
  uid: "UniProtKB/Swiss-Prot UID",
  "entry-name": "UniProtKB/Swiss-Prot entry name",
  phylum: "Phylum",
  class: "Class",
  order: "Order",
  family: "Family",
  genus: "Genus",
  species: "Species",
  strain: "Strain",
  sorf: "sORF",
  slen: "sORF length",
  "start-codon": "Start codon",
  protein: "Protein",
  plen: "Protein length",
  product: "Product",
  rbs: "Ribosomal binding site",
  "pfam-hits": "Pfam hits",
  gravy: "Gravy",
  aromaticity: "Aromaticity",
  "molecular-weight": "Molecular weight",
  instability: "Instability",
  "isoelectric-point": "Isoelectric point",
  "aliphatic-index": "Aliphatic-index",
  boman: "Boman",
};

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
  selectedColumns.value = defaultSelectedColumns;
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
              <div class="mx-3">
                <h5>General</h5>
                <CheckboxSelection
                  v-model="selectedColumns"
                  :options="columnIDs"
                />
              </div>
              <div class="mx-3">
                <h5>Taxonomy</h5>
                <CheckboxSelection
                  v-model="selectedColumns"
                  :options="columnTaxonomy"
                />
              </div>
              <div class="mx-3">
                <h5>Sequence&nbsp;features</h5>

                <CheckboxSelection
                  v-model="selectedColumns"
                  :options="columnSequenceFeatures"
                />
              </div>
              <div class="mx-3">
                <h5>Protein&nbsp;descriptors</h5>
                <CheckboxSelection
                  v-model="selectedColumns"
                  :options="columnDescriptors"
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
          <div class="col-12">
            <ResultTable
              :ordering="ordering"
              :entries="entries"
              @update:ordering="updateOrdering"
              :visible-columns="selectedColumns"
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
