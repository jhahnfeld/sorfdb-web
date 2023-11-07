<template>
  <div class="container page-body flex-grow-1 mb-5 pb-5">
    <div class="row">
      <h2>Sequence search</h2>
    </div>
    <ul class="nav nav-underline">
      <li class="nav-item">
        <span class="nav-link disabled">Search by</span>
      </li>
      <li v-for="e of sequenceMode" :key="e" class="nav-item">
        <button
          class="nav-link"
          :class="{ active: e == activeSequenceMode }"
          aria-current="page"
          @click="activeSequenceMode = e"
        >
          {{ e }}
        </button>
      </li>
    </ul>

    <form ref="submitform" @submit.prevent="submit()">
      <template v-if="activeSequenceMode === 'Protein sequence(s)'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your protein sequence here..."
          aria-label="Paste your protein sequence here..."
          autofocus="true"
          rows="3"
        ></textarea>
        <p>Examples: MRTGNAN, ...</p>
      </template>
      <template v-if="activeSequenceMode === 'Nucleotide sequence(s)'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your nucleotide sequence here..."
          aria-label="Paste your nucleotide sequence here..."
          autofocus="true"
          rows="3"
        ></textarea>
        <p>Example: ATGCGGG, ...</p>
      </template>
      <template
        v-if="
          activeSequenceMode === 'Nucleotide sequence(s)' ||
          activeSequenceMode === 'Protein sequence(s)'
        "
      >
        <input
          class="form-control"
          type="file"
          id="fastaFile"
          @input="updateSequenceFile"
          accept=".faa,.fas,.fna,.fasta,.faa.gz,.fna.gz,.fas.gz,.fasta.gz"
        />
      </template>
      <template v-if="activeSequenceMode === 'Ids'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your ids here (one id per line)..."
          aria-label="Paste your ids here (one id per line)..."
          autofocus="true"
          rows="3"
        ></textarea>
        <p>Examples:</p>
        <pre>
          GenBank|AAAC01000001.1|sORF_1453359_1453485_-
          GenBank|AAAC01000001.1|sORF_1534298_1534442_-
        </pre>
      </template>
      <h5 class="mb-2">Search mode:</h5>
      <div
        v-for="mode of alignModes"
        :key="mode"
        class="form-check form-check-inline"
      >
        <input
          class="form-check-input"
          type="radio"
          :id="`${mode}-radio`"
          :value="mode"
          v-model="activeAlignMode"
        />
        <label class="form-check-label" :for="`${mode}-radio`">
          {{ mode }}
        </label>
      </div>

      <template v-if="activeAlignMode === 'Blast'">
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
      </template>

      <div class="d-flex justify-content-end mb-5">
        <button
          v-if="!submitting"
          class="btn btn-primary"
          type="button"
          id="submit-button"
          :disabled="!isValid"
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
  </div>
</template>
<script setup lang="ts">
import { validateDNA, validateProtein } from "@/search-validator";
import { computed, ref, type PropType } from "vue";
import type { SequenceSearchRequest } from "./SequenceSearchRequest";

const props = defineProps({
  submitting: { type: Boolean as PropType<boolean>, required: true },
});
const emit = defineEmits<{
  (e: "search", v: SequenceSearchRequest): void;
}>();

const sequenceMode = [
  "Protein sequence(s)",
  "Nucleotide sequence(s)",
  "Ids",
] as const;
const activeSequenceMode = ref<(typeof sequenceMode)[number]>(sequenceMode[0]);
const alignModes = ["Exact", "Blast"] as const;
const activeAlignMode = ref<(typeof alignModes)[number]>(alignModes[0]);

const isValid = computed(() => {
  if (activeAlignMode.value === "Exact" && sequence.value.length > 0)
    if (
      activeSequenceMode.value === "Protein sequence(s)" &&
      validateProtein(sequence.value)
    )
      return true;
    else if (
      activeSequenceMode.value === "Nucleotide sequence(s)" &&
      validateDNA(sequence.value)
    )
      return true;

  return false;
});

function updateSequenceFile(evt: Event) {
  if (evt.target instanceof HTMLInputElement && evt.target.files) {
    sequenceFile.value = evt.target.files.item(0);
  }
}

const sequence = ref("");
const sequenceFile = ref<File | null>(null);
const identity = ref(90);
const coverage = ref(80);

const submit = () => {
  if (activeSequenceMode.value === "Protein sequence(s)") {
    if (activeAlignMode.value === "Exact")
      emit("search", {
        mode: "exact",
        sequences: [sequence.value],
        type: "protein",
      });
  }
};
</script>
