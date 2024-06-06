<template>
  <div class="container page-body flex-grow-1 mb-2">
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

    <form ref="submitform" @submit.prevent="dummySubmit()">
      <template v-if="activeSequenceMode === 'Protein sequence(s)'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your single protein sequence or proteins in FASTA format here..."
          aria-label="Paste your single protein sequence or proteins in FASTA format here..."
          autofocus="true"
          :disabled="sequenceFile != null && sequence.length == 0"
          rows="3"
        ></textarea>
        <p style="margin-top: 1em">
          Examples: MSTFQALMLMLAIGSFIIALLTYIEKIDLP or
        </p>
        <pre>
>SwissProt|A0A2K4Z9J5|BSRE_BACSU<br>MSTFQALMLMLAIGSFIIALLTYIEKIDLP</pre>
      </template>
      <template v-if="activeSequenceMode === 'Nucleotide sequence(s)'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your single nucleotide sequence or nucleotide sequences in FASTA format here.."
          aria-label="Paste your single nucleotide sequence or nucleotide sequences in FASTA format here.."
          autofocus="true"
          :disabled="sequenceFile != null && sequence.length == 0"
          rows="3"
        ></textarea>
        <p style="margin-top: 1em">
          Example: ATGACACGCGTTCAATTTAAACACCACCATCATCACCATCATCCTGACTAG or
        </p>
        <pre>
>GenBank|ABFMQO020000063.1|MCU9633280.1<br>ATGACACGCGTTCAATTTAAACACCACCATCATCACCATCATCCTGACTAG
        </pre>
      </template>
      <template v-if="activeSequenceMode === 'sORFdb IDs'">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          placeholder="Paste your sORFdb IDs here or upload them in a TXT file (one ID per line)..."
          aria-label="Paste your sORFdb IDs here (one Id per line)..."
          autofocus="true"
          :disabled="sequenceFile != null && sequence.length == 0"
          rows="3"
        ></textarea>
        <p style="margin-top: 1em">Examples:</p>
        <pre>
SwissProt|A0A2K4Z9J5|BSRE_BACSU<br>GenBank|AABOTI020000010.1|MPA92906.1
        </pre>
      </template>
      <div class="mb-2 pb-2">
        <input
          class="form-control"
          type="file"
          id="fastaFile"
          @input="updateSequenceFile"
          :accept="allowedFileTypes(activeSequenceMode)"
        />
      </div>
      <progress-bar
        v-if="loading"
        :progress="loadingProgress"
        :title="loadingProgress.title"
      />
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
      <template v-if="activeSequenceMode !== 'sORFdb IDs'">
        <ul class="nav nav-underline" style="margin-top: 1em">
          <li class="nav-item">
            <span class="nav-link disabled"><h5>Search mode</h5></span>
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
      </template>

      <div class="d-flex justify-content-end mb-5">
        <button
          v-if="!submitting"
          class="btn btn-primary"
          type="button"
          id="submit-button"
          :disabled="!isValid.valid"
          @click.self="submit"
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
import { extractSequencesFromFasta, uniqueArray } from "@/fasta-handler";
import type { SequenceSearchRequest } from "./SequenceSearchRequest";
import notificationMessage from "@/components/Notification.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import readFileWithProgress from "@/read-file-with-progress";

const props = defineProps({
  submitting: { type: Boolean as PropType<boolean>, required: true },
});
const emit = defineEmits<{
  (e: "search", v: SequenceSearchRequest): void;
  (
    e: "blastSearch",
    v: {
      seqs: string[];
      mode: string;
      id: number;
      cov: number;
    },
  ): void;
}>();

const sequenceMode = [
  "Protein sequence(s)",
  "Nucleotide sequence(s)",
  "sORFdb IDs",
] as const;
const maxSequenceLengths: Record<string, number> = {
  "Protein sequence(s)": 143,
  "Nucleotide sequence(s)": 433,
};
const activeSequenceMode = ref<(typeof sequenceMode)[number]>(sequenceMode[0]);
const alignModes = ["Exact", "Blast"] as const;
const activeAlignMode = ref<(typeof alignModes)[number]>(alignModes[0]);
const sequence = ref("");
const sequenceFile = ref<File | null>(null);
const sequenceFileContent = ref("");
const loading = ref(false);
const identity = ref(90);
const coverage = ref(80);
const loadingProgress = ref({
  title: "Loading FASTA file...",
  min: 0,
  max: 100,
  value: 0,
});

function allowedFileTypes(mode: string): string {
  if (mode == "Ids") {
    return ".txt";
  } else {
    return ".faa,.fas,.fna,.fasta,.faa.gz,.fna.gz,.fas.gz,.fasta.gz";
  }
}

const sequences = computed<string[]>(() => {
  if (sequence.value.startsWith(">") || sequence.value.startsWith("@")) {
    return extractSequencesFromFasta(
      sequence.value,
      maxSequenceLengths[activeSequenceMode.value],
    ).filter(
      (x) =>
        x.length > 0 && x.length < maxSequenceLengths[activeSequenceMode.value],
    );
  } else if (sequence.value.length > 0) {
    if ((sequence.value.match(/\n/) || []).length == 0) {
      return [sequence.value.trim()].filter(
        (x) =>
          x.length > 0 &&
          x.length < maxSequenceLengths[activeSequenceMode.value],
      );
    } else {
      return uniqueArray(sequence.value.split("\n"))
        .map((x) => x.trim())
        .filter(
          (x) =>
            x.length > 0 &&
            x.length < maxSequenceLengths[activeSequenceMode.value],
        );
    }
  } else if (sequenceFileContent.value.length > 0) {
    if (
      sequenceFileContent.value.startsWith(">") ||
      sequence.value.startsWith("@")
    ) {
      return extractSequencesFromFasta(
        sequenceFileContent.value,
        maxSequenceLengths[activeSequenceMode.value],
      ).filter(
        (x) =>
          x.length > 0 &&
          x.length < maxSequenceLengths[activeSequenceMode.value],
      );
    } else {
      return uniqueArray(sequenceFileContent.value.split("\n"))
        .map((x) => x.trim())
        .filter(
          (x) =>
            x.length > 0 &&
            x.length < maxSequenceLengths[activeSequenceMode.value],
        );
    }
  } else {
    return [];
  }
});

const isValid = computed(() => {
  if (new Blob(sequences.value).size / (1024 * 1024) >= 46) {
    return {
      valid: false,
      error:
        "The sequence search is limited to 50MB. Please perform a local search. Small proteins, sORFs and HMMs for small protein families are available in the Download tab. Recommended BLAST parameters are available in the FAQ.",
    };
  }
  if (sequences.value.length > 50000000) {
    return {
      valid: false,
      error:
        "The sequence search is limited to 50,000,000 sequences. Please perform a local search. Small proteins, sORFs and HMMs for small protein families are available in the Download tab. Recommended BLAST parameters are available in the FAQ.",
    };
  }
  if (sequence.value.length > 0 && sequenceFile.value != null) {
    return {
      valid: false,
      error: "Please use the input field or an uploaded file not both!",
    };
  }
  if (sequence.value.length > 0 && sequences.value.length == 0) {
    return {
      valid: false,
      error:
        "All submitted sequences appear to be invalid. This means that they are either too long or too short.",
    };
  }
  if (sequence.value.length > 0) {
    if (
      (activeSequenceMode.value === "Protein sequence(s)" &&
        (sequence.value.startsWith(">") || sequence.value.startsWith("@")) &&
        validateInputArray(sequences.value, validateProtein)) ||
      (activeSequenceMode.value === "Protein sequence(s)" &&
        validateProtein(sequence.value.trim()))
    ) {
      return { valid: true, error: "" };
    } else if (
      (activeSequenceMode.value === "Nucleotide sequence(s)" &&
        (sequence.value.startsWith(">") || sequence.value.startsWith("@")) &&
        validateInputArray(sequences.value, validateDNA)) ||
      (activeSequenceMode.value === "Nucleotide sequence(s)" &&
        validateDNA(sequence.value.trim()))
    ) {
      return { valid: true, error: "" };
    } else if (
      activeSequenceMode.value === "sORFdb IDs" &&
      validateInputArray(sequences.value, matchesIdScheme)
    ) {
      return { valid: true, error: "" };
    } else if (sequence.value.length > 0) {
      return {
        valid: false,
        error: `Could not match input with type: ${activeSequenceMode.value}`,
      };
    }
  } else if (sequence.value.length == 0 && sequences.value.length > 0) {
    if (
      activeSequenceMode.value === "Protein sequence(s)" &&
      validateInputArray(sequences.value, validateProtein)
    ) {
      return { valid: true, error: "" };
    } else if (
      activeSequenceMode.value === "Nucleotide sequence(s)" &&
      validateInputArray(sequences.value, validateDNA)
    ) {
      return { valid: true, error: "" };
    } else if (
      activeSequenceMode.value === "sORFdb IDs" &&
      validateInputArray(sequences.value, matchesIdScheme)
    ) {
      return { valid: true, error: "" };
    } else {
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

function readTextFile(file: File): Promise<string> {
  loading.value = true;
  return readFileWithProgress(
    file,
    (x: number) => (loadingProgress.value.value = Math.floor(x * 100)),
  ).then((buffer) => {
    loadingProgress.value.title = "Processing file content...";
    return new Promise<string>((resolve) => {
      let decoder = new TextDecoder("utf-8");
      resolve(decoder.decode(buffer));
    });
  });
}

function setFileSequence(content: string): void {
  sequenceFileContent.value = content;
  loading.value = false;
}

function updateSequenceFile(evt: Event): void {
  if (evt.target instanceof HTMLInputElement && evt.target.files) {
    sequenceFile.value = evt.target.files.item(0);
    if (sequenceFile.value === null) {
      sequenceFileContent.value = "";
    } else {
      readTextFile(sequenceFile.value)
        .then((r) => setFileSequence(r))
        .catch((e) => (isValid.value.error = e));
    }
  }
  loadingProgress.value.title = "Loading FASTA file...";
}

const dummySubmit = () => {};

const submit = async () => {
  console.log(sequences.value);
  if (activeSequenceMode.value === "Protein sequence(s)") {
    if (activeAlignMode.value === "Exact") {
      emit("search", {
        mode: "exact",
        sequences: sequences.value,
        type: "protein",
      });
    } else if (activeAlignMode.value === "Blast") {
      emit("blastSearch", {
        seqs: sequences.value,
        mode: "blastp",
        id: identity.value,
        cov: coverage.value,
      });
    }
  } else if (activeSequenceMode.value === "Nucleotide sequence(s)") {
    if (activeAlignMode.value === "Exact") {
      emit("search", {
        mode: "exact",
        sequences: sequences.value,
        type: "dna",
      });
    } else if (activeAlignMode.value === "Blast") {
      emit("blastSearch", {
        seqs: sequences.value,
        mode: "blastx",
        id: identity.value,
        cov: coverage.value,
      });
    }
  } else if (activeSequenceMode.value === "sORFdb IDs") {
    emit("search", {
      ids: sequences.value,
      type: "id",
    });
  }
};
</script>
