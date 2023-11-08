<template>
  <div class="row">
    <div class="btn-group py-3">
      <DropdownCheckbox title="Select visible columns">
        <div class="d-flex">
          <div class="mx-4" v-for="g in groupedColumns" :key="g[0]">
            <h5 v-html="g[0]"></h5>
            <CheckboxSelectionWithVModel
              :model-value="visibleColumns"
              @update:modelValue="updateVisibleColumns"
              :options="g[1]"
            />
          </div>
        </div>
      </DropdownCheckbox>

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
          @update:ordering="(key, dir) => emit('update:ordering', key, dir)"
          :visible-columns="visibleColumns"
        />
      </div>
      <Pagination
        v-if="pagination.total > 0"
        class="mt-3"
        :value="pagination"
        @update:offset="(offset) => emit('search', offset)"
      />
    </div>
  </Loading>
</template>
<script setup lang="ts">
import { type PageState } from "@/PageState";
import type { SorfdbApi } from "@/SorfdbApi";
import type { Option } from "@/components/CheckboxOption";
import CheckboxSelectionWithVModel from "@/components/CheckboxSelectionWithVModel.vue";
import DropdownCheckbox from "@/components/DropdownCheckbox.vue";
import Loading from "@/components/Loading.vue";
import {
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import type { Query, SortDirection, SortOption } from "@/model/Search";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import { saveAs } from "file-saver";
import { computed, onBeforeUnmount, ref, type PropType, type Ref } from "vue";
import ExportProgress from "./ExportProgress.vue";
import { downloadFullTsv, type ProgressEvent } from "./ExportTsv";
import { defaultColumns } from "./ResultColumns";
import ResultTable from "./ResultTable.vue";

const props = defineProps({
  allColumns: { type: Array as PropType<Option[]>, required: true },
  api: { type: Object as PropType<SorfdbApi>, required: true },
  query: { type: Object as PropType<Query>, required: true },
  searchState: { type: Object as PropType<PageState>, required: true },
  ordering: { type: Array as PropType<SortOption[]>, required: true },
  entries: { type: Array as PropType<SorfdbEntry[]>, required: true },
  pagination: { type: Object as PropType<PaginationData>, required: true },
  exportInProgress: { type: Boolean },
});

const emit = defineEmits<{
  (e: "update:ordering", key: string, direction: SortDirection | null): void;
  (e: "update:exportInProgress", v: boolean): void;
  (e: "search", offset: number): void;
}>();

const selectedColumns = ref<string[]>(defaultColumns());
const visibleColumns = computed(() => {
  return props.allColumns.filter((c) =>
    selectedColumns.value.some((s) => s == c.key),
  );
});
const groupedColumns = computed(() => {
  const groups: Record<string, Option[]> = {};
  for (const c of props.allColumns) {
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
function clearSelection() {
  selectedColumns.value = [];
}

function resetSelection() {
  selectedColumns.value = defaultColumns();
}

const positionInResults: Ref<PositionInResult> = computed(() =>
  toPosition(props.pagination),
);

let cancelExport: AbortController | undefined = undefined;
const progress = ref<ProgressEvent>();
const exportError = ref<string>();
function exportTsv() {
  exportError.value = undefined;
  emit("update:exportInProgress", true);
  progress.value = { total: props.pagination.total, count: 0, progress: 0 };
  cancelExport = downloadFullTsv(
    props.api,
    {
      query: props.query,
      sort: [{ field: "id", ord: "asc" }],
    },
    {
      onError: (e) => {
        exportError.value = e as string;
        emit("update:exportInProgress", false);
      },
      onFinished: (d) => {
        const blob = new Blob([d], {
          type: "text/tab-separated-values;charset=utf-8",
        });
        saveAs(blob, "sorfdb-export.tsv");
        emit("update:exportInProgress", false);
        cancelExport = undefined;
      },
      onProgress: (p) => (progress.value = p),
    },
  );
}

function resetTsvExport() {
  progress.value = undefined;
  exportError.value = undefined;
  emit("update:exportInProgress", false);
}

defineExpose({ resetTsvExport });
onBeforeUnmount(() => {
  if (cancelExport) cancelExport.abort();
});
</script>
