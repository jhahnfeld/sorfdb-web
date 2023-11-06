<script setup lang="ts">
import { useApi } from "@/BakrepApi";
import usePageState, { State } from "@/PageState";
import Loading from "@/components/Loading.vue";
import QueryFilter from "@/components/QueryFilter.vue";
import {
  empty,
  toPosition,
  type PaginationData,
  type PositionInResult,
} from "@/components/pagination/Pagination";
import Pagination from "@/components/pagination/Pagination.vue";
import type { BakrepSearchResultEntry } from "@/model/BakrepSearchResult";
import type { SortOption, SortDirection } from "@/model/Search";
import ExportProgress from "./browse/ExportProgress.vue";
import { downloadFullTsv, type ProgressEvent } from "./browse/ExportTsv";

import CheckboxSelection from "@/components/CheckboxSelectionWithVModel.vue";
import CheckboxDropdown from "@/components/DropdownCheckbox.vue";

import ResultTable from "@/views/browse/ResultTable.vue";
import { computed, onMounted, ref, watch, type Ref } from "vue";
import Notification from "../components/Notification.vue";
import {
  guessInputType,
  validateProtein,
  validateDNA,
  matchesIdScheme,
} from "../search-validator";

const searchState = usePageState();
const entries: Ref<BakrepSearchResultEntry[]> = ref([]);
const api = useApi();
const pagination: Ref<PaginationData> = ref(empty());

export type FilterTuple = {
  from: number;
  to: number;
};

const sizeTuple = ref<FilterTuple>({ from: 0, to: 9999999 });
const gcTuple = ref<FilterTuple>({ from: 0, to: 100 });
const contigTuple = ref<FilterTuple>({ from: 0, to: 1000 });
const qualityTuple = ref<FilterTuple>({ from: 0, to: 100 });
const contaminationTuple = ref<FilterTuple>({ from: 0, to: 100 });

const error = ref("");
const sequence = ref("");
const sequenceLength = ref(sequence.value.length);
const sequenceFile = ref(null);
const inputType = ref("auto");
const searchType = ref("exact");
const identity = ref(90);
const coverage = ref(80);
const submitting = ref(false);
const validSequence = ref(false);
const validSequenceFile = ref(false);
const valid = ref(false);

watch(sequence, (newSequence) => {
  sequenceLength.value = newSequence.length;
  if (newSequence.length == 0) {
    validSequence.value = false;
    error.value = "";
  } else if (inputType.value == "auto") {
    let guessedType = guessInputType(newSequence);
    if (guessedType.valid) {
      inputType.value = guessedType.type;
      validSequence.value = true;
      error.value = "";
    } else {
      validSequence.value = false;
      error.value = "Could not guess input type.";
    }
  } else if (inputType.value == "protein" && validateProtein(newSequence)) {
    validSequence.value = true;
    error.value = "";
  } else if (inputType.value == "dna" && validateDNA(newSequence)) {
    validSequence.value = true;
    error.value = "";
  } else if (inputType.value == "id" && matchesIdScheme(newSequence)) {
    validSequence.value = true;
    error.value = "";
  } else {
    validSequence.value = false;
    error.value = `Could not match input with type: ${inputType.value}`;
  }
});
watch(inputType, (newInputType) => {
  if (sequence.value.length == 0) {
    validSequence.value = false;
    error.value = "";
  } else if (newInputType == "auto") {
    let guessedType = guessInputType(sequence.value);
    if (guessedType.valid) {
      inputType.value = guessedType.type;
      validSequence.value = true;
      error.value = "";
    } else {
      validSequence.value = false;
      error.value = "Could not guess input type.";
    }
  } else if (newInputType == "protein" && validateProtein(sequence.value)) {
    validSequence.value = true;
    error.value = "";
  } else if (newInputType == "dna" && validateDNA(sequence.value)) {
    validSequence.value = true;
    error.value = "";
  } else if (newInputType == "id" && matchesIdScheme(sequence.value)) {
    validSequence.value = true;
    error.value = "";
  } else {
    validSequence.value = false;
    error.value = `Could not match input with type: ${inputType.value}`;
  }
});
watch(validSequence, (v) => {
  if (v) {
    valid.value = true;
    error.value = "";
  } else {
    valid.value = false;
  }
});
const submit = () => {
  submitting.value = true;
  console.log(sequence.value, inputType.value);
  console.log(sequence.value);
};

function filter(offset = 0) {
  let query;
  query = {
    op: "and",
    value: [
      // Size Filter

      {
        field: "bakta.stats.size",
        op: "[]",
        value: sizeTuple.value,
      },

      {
        field: "bakta.stats.gc",
        op: "[]",
        value: { from: gcTuple.value.from / 100, to: gcTuple.value.to / 100 },
      },
      // Contig Count Filter

      {
        field: "bakta.stats.no_sequences",
        op: "[]",
        value: contigTuple.value,
      },

      // Quality Filter

      {
        field: "checkm2.quality.completeness",
        op: "[]",
        value: qualityTuple.value,
      },

      // Contamination Filter

      {
        field: "checkm2.quality.contamination",
        op: "[]",
        value: contaminationTuple.value,
      },
    ],
  };

  searchState.value.setState(State.Loading);

  api
    .search({
      query: query,
      sort: ordering.value,
      offset: offset,
      limit: 10,
    })
    .then((r) => {
      entries.value = r.results;
      searchState.value.setState(State.Main);
      if (r.offset) pagination.value.offset = r.offset;
      pagination.value.total = r.total;
    })
    .catch((err) => searchState.value.setError(err));
}

const ordering: Ref<SortOption[]> = ref([{ field: "id", ord: "asc" }]);

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
  filter();
}

onMounted(filter);
</script>

<template>
  <main class="container pt-5">
    <div class="container page-body flex-grow-1">
      <div class="row">
        <h2>Sequence search</h2>
      </div>
      <form ref="submitform" @submit.prevent="submit()">
        <div class="mb-3">
          <textarea
            class="form-control form-control-lg"
            type="text"
            v-model.trim="sequence"
            id="searchfield"
            name="searchfield"
            placeholder="Paste your ID, protein or sORF sequence here..."
            aria-label="Paste your ID, protein or sORF sequence here..."
            autofocus="true"
            rows="3"
            minlength="7"
            maxlength="303"
            required="true"
            onkeypress="return event.keyCode != 13;"
          ></textarea>
          <p>Examples: MRTGNAN, ...</p>
        </div>
        <div class="input-group mb-3">
          <input
            class="form-control"
            type="file"
            id="fastaFile"
            accept=".faa,.fas,.fna,.fasta,.faa.gz,.fna.gz,.fas.gz,.fasta.gz"
          />
        </div>
        <h5 class="mb-2">Input type</h5>
        <div class="mb-3">
          <label class="form-check-label" for="inputTypeAuto">
            <input
              class="form-check-input"
              type="radio"
              v-model="inputType"
              value="auto"
              name="inputType"
              id="inputTypeAuto"
              checked
            />
            Auto
          </label>
          <label class="form-check-label" for="inputTypeProtein">
            <input
              class="form-check-input"
              type="radio"
              v-model="inputType"
              value="protein"
              name="inputType"
              id="inputTypeProtein"
            />
            Protein
          </label>
          <label class="form-check-label" for="inputTypeDNA">
            <input
              class="form-check-input"
              type="radio"
              v-model="inputType"
              value="dna"
              name="inputType"
              id="inputTypeDNA"
            />
            DNA
          </label>
          <label class="form-check-label" for="inputTypeId">
            <input
              class="form-check-input"
              type="radio"
              v-model="inputType"
              value="id"
              name="inputType"
              id="inputTypeId"
            />
            ID
          </label>
        </div>

        <h5 class="mb-2">Search type</h5>
        <div class="mb-3">
          <label class="form-check-label" for="inputTypeAuto">
            <input
              class="form-check-input"
              type="radio"
              v-model="searchType"
              value="auto"
              name="searchType"
              id="searchType"
              checked
            />
            Exact (fast)
          </label>
          <label class="form-check-label" for="inputTypeProtein">
            <input
              class="form-check-input"
              type="radio"
              v-model="searchType"
              value="protein"
              name="searchType"
              id="searchType"
            />
            BLAST
          </label>
        </div>

        <h5 class="mb-2">BLAST search parameters</h5>
        <div class="mb-3">
          <label class="form-label" for="identity">
            Identity
            <input
              class="form-control"
              type="number"
              min="30"
              max="100"
              v-model.number="identity"
              id="identity"
            />
          </label>
          <label class="form-label" for="coverage">
            Coverage
            <input
              class="form-control"
              type="number"
              min="30"
              max="100"
              v-model.number="coverage"
              id="coverage"
            />
          </label>
        </div>

        <div class="d-flex justify-content-beginning mb-5">
          <button
            v-if="!submitting"
            class="btn btn-primary"
            type="button"
            id="submit-button"
            :disabled="!valid"
            @click="submit"
          >
            Search
          </button>
          <button
            v-if="submitting"
            class="btn btn-secondary"
            type="button"
            disabled
          >
            Searching...
          </button>
        </div>
      </form>
      <notification :message="error" />
    </div>

    <!--TODO add tsv export-->
    <Loading :state="searchState">
      <div class="row px-3">
        Showing results {{ positionInResults.firstElement }}-{{
          positionInResults.lastElement
        }}
        of {{ pagination.total }} results
        <ResultTable
          :ordering="ordering"
          :entries="entries"
          @update:ordering="updateOrdering"
        />
        <Pagination class="mt-3" :value="pagination" @update:offset="filter" />
      </div>
    </Loading>
  </main>
</template>

<style>
label + label {
  margin-left: 10px;
}
</style>
