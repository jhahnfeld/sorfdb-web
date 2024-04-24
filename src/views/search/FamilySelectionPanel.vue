<template>
  <div class="container page-body flex-grow-1 mb-2">
    <form ref="submitform" @submit.prevent="dummySubmit()">
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
      <p style="margin-top: 1em">Examples: MSTFQALMLMLAIGSFIIALLTYIEKIDLP or</p>
      <pre>
          >SwissProt|A0A2K4Z9J5|BSRE_BACSU
          MSTFQALMLMLAIGSFIIALLTYIEKIDLP
        </pre
      >
      <div class="mb-2 pb-2">
        <input
          class="form-control"
          type="file"
          id="fastaFile"
          @input="updateSequenceFile"
          :accept="'.faa,.fas,.fasta,.faa.gz,.fas.gz,.fasta.gz'"
        />
      </div>
      <progress-bar
        v-if="loading"
        :progress="loadingProgress"
        :title="loadingProgress.title"
      />

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
import { validateProtein, validateInputArray } from "@/search-validator";
import { computed, ref, type PropType } from "vue";
import {
  extractSequencesFromFasta,
  fastaFromSequences,
  uniqueArray,
} from "@/fasta-handler";
import type { SequenceSearchRequest } from "./SequenceSearchRequest";
import notificationMessage from "@/components/Notification.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import readFileWithProgress from "@/read-file-with-progress";
import { getPsosSorfdbHits } from "@/PsosApi";

const props = defineProps({
  submitting: { type: Boolean as PropType<boolean>, required: true },
});
const emit = defineEmits<{
  (e: "search", v: SequenceSearchRequest): void;
}>();

const sequence = ref("");
const sequenceFile = ref<File | null>(null);
const sequenceFileContent = ref("");
const loading = ref(false);
const loadingProgress = ref({
  title: "Loading FASTA file...",
  min: 0,
  max: 100,
  value: 0,
});

const sequences = computed<string[]>(() => {
  if (sequence.value.startsWith(">") || sequence.value.startsWith("@")) {
    return extractSequencesFromFasta(sequence.value, 143);
  } else if (sequence.value.length > 0) {
    if ((sequence.value.match(/\n/) || []).length == 0) {
      return [sequence.value];
    } else {
      return uniqueArray(sequence.value.split("\n")).filter(
        (x) => x.length > 0,
      );
    }
  } else if (sequenceFileContent.value.length > 0) {
    if (
      sequenceFileContent.value.startsWith(">") ||
      sequence.value.startsWith("@")
    ) {
      return extractSequencesFromFasta(sequenceFileContent.value, 143);
    } else {
      return uniqueArray(sequenceFileContent.value.split("\n")).filter(
        (x) => x.length > 0,
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
  if (sequence.value.length > 0) {
    if (
      ((sequence.value.startsWith(">") || sequence.value.startsWith("@")) &&
        validateInputArray(sequences.value, validateProtein)) ||
      validateProtein(sequence.value.trim())
    ) {
      return { valid: true, error: "" };
    } else if (sequence.value.length > 0) {
      return {
        valid: false,
        error: "Could not match input with type protein.",
      };
    }
  } else if (sequence.value.length == 0 && sequences.value.length > 0) {
    if (validateInputArray(sequences.value, validateProtein)) {
      return { valid: true, error: "" };
    } else {
      return {
        valid: false,
        error: "Could not match input with type protein.",
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
  const hits: string[] = await getPsosSorfdbHits(
    fastaFromSequences(sequences.value),
  );
  console.log("Search input");
  console.log(hits);
  emit("search", {
    ids: hits,
    type: "id",
  });
};
</script>
