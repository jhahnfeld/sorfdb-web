<template>
  <div class="container page-body flex-grow-1 mb-2">
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
          placeholder="Paste your single protein sequence or proteins in FASTA format here..."
          aria-label="Paste your single protein sequence or proteins in FASTA format here..."
          autofocus="true"
          rows="3"
        ></textarea>
        <p>Examples: MRTGNAN or</p>
        <pre>
          >SwissProt|Q47505|MCCC7_ECOLX
          MRTGNAN
        </pre>
      </template>
      <template v-if="activeSequenceMode === 'Nucleotide sequence(s)'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your single nucleotide sequence or nucleotide sequences in FASTA format here.."
          aria-label="Paste your single nucleotide sequence or nucleotide sequences in FASTA format here.."
          autofocus="true"
          rows="3"
        ></textarea>
        <p>Example: ATGGAACTGACGGGGGACCCGGAGTGA or</p>
        <pre>
          >MyDnaSequence
          ATGGAACTGACGGGGGACCCGGAGTGA
        </pre>
      </template>
      <template
        v-if="
          activeSequenceMode === 'Nucleotide sequence(s)' ||
          activeSequenceMode === 'Protein sequence(s)'
        "
      >
        <div class="mb-2 pb-2">
          <input
            class="form-control"
            type="file"
            id="fastaFile"
            @input="updateSequenceFile"
            accept=".faa,.fas,.fna,.fasta,.faa.gz,.fna.gz,.fas.gz,.fasta.gz"
          />
        </div>
      </template>
      <template v-if="activeSequenceMode === 'Ids'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your Ids here (one Id per line)..."
          aria-label="Paste your Ids here (one Id per line)..."
          autofocus="true"
          rows="3"
        ></textarea>
        <p>Examples:</p>
        <pre>
          SwissProt|Q47505|MCCC7_ECOLX
          GenBank|AABOTI020000010.1|MPA92906.1
        </pre>
      </template>
      <!--
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
      -->
      <ul class="nav nav-underline">
        <li class="nav-item">
          <span class="nav-link disabled">Search mode</span>
        </li>
        <li v-for="mode of alignModes" :key="mode" class="nav-item">
          <button
            class="nav-link"
            :class="{ active: mode == activeAlignMode }"
            aria-current="page"
            @click="activeAlignMode = mode"
          >
            {{ mode }}
          </button>
        </li>
      </ul>

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
          :disabled="!isValid.valid"
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
  <notificationMessage :message="isValid.error" />
</template>
<script setup lang="ts">
import {
  validateDNA,
  validateProtein,
  matchesIdScheme,
  validateInputArray,
} from "@/search-validator";
import { computed, ref, type PropType } from "vue";
import { parseFastaFromText, excludeFastaHeaders } from "@/fasta-handler";
import type { SequenceSearchRequest } from "./SequenceSearchRequest";
import notificationMessage from "@/components/Notification.vue";

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
const sequence = ref("");
const sequenceFile = ref<File | null>(null);
const identity = ref(90);
const coverage = ref(80);

function stringToArray(input: string): string[] {
  if ((input.match(/\n/) || []).length == 0) {
    return [input];
  } else {
    if (input.startsWith(">")) {
      return parseFastaFromText(input);
    } else {
      return input.split("\n");
    }
  }
}

const sequences = computed(() => {
  if (sequence.value.startsWith(">")) {
    return excludeFastaHeaders(stringToArray(sequence.value));
  }
  return stringToArray(sequence.value);
});

const isValid = computed(() => {
  if (sequence.value.length > 0 && sequenceFile.value != null) {
    return {
      valid: false,
      error: "Please use the input field or an uploaded file not both!",
    };
  }
  if (activeAlignMode.value === "Exact" && sequence.value.length > 0) {
    if (
      (activeSequenceMode.value === "Protein sequence(s)" &&
        sequence.value.startsWith(">") &&
        validateInputArray(sequences.value, validateProtein)) ||
      (activeSequenceMode.value === "Protein sequence(s)" &&
        validateProtein(sequence.value))
    ) {
      return { valid: true, error: "" };
    } else if (
      (activeSequenceMode.value === "Nucleotide sequence(s)" &&
        sequence.value.startsWith(">") &&
        validateInputArray(sequences.value, validateDNA)) ||
      (activeSequenceMode.value === "Nucleotide sequence(s)" &&
        validateDNA(sequence.value))
    ) {
      return { valid: true, error: "" };
    } else if (
      activeSequenceMode.value === "Ids" &&
      validateInputArray(sequences.value, matchesIdScheme)
    ) {
      return { valid: true, error: "" };
    } else if (sequence.value.length > 0) {
      return {
        valid: false,
        error: `Could not match input with type: ${activeSequenceMode.value}`,
      };
    }
  }

  return {
    valid: false,
    error: "",
  };
});

function updateSequenceFile(evt: Event) {
  if (evt.target instanceof HTMLInputElement && evt.target.files) {
    sequenceFile.value = evt.target.files.item(0);
  }
}

const submit = () => {
  if (activeSequenceMode.value === "Protein sequence(s)") {
    if (activeAlignMode.value === "Exact")
      emit("search", {
        mode: "exact",
        sequences: sequences.value,
        type: "protein",
      });
  }
};
</script>
