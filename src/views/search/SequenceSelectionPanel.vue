<template>
  <div class="container page-body flex-grow-1">
    <div class="row">
      <h2>Sequence search</h2>
    </div>
    <form ref="submitform" @submit.prevent="submit()">
      <div class="mb-3">
        <textarea
          class="form-control form-control-lg"
          type="text"
          v-model="sequence"
          id="searchfield"
          name="searchfield"
          placeholder="Paste your ID, protein or sORF sequence here..."
          aria-label="Paste your ID, protein or sORF sequence here..."
          autofocus="true"
          rows="3"
          minlength="7"
          maxlength="303"
          required="true"
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
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import type { SequenceSearchRequest } from "./SequenceSearchRequest";
import Notification from "@/components/Notification.vue";
import {
  guessInputType,
  matchesIdScheme,
  validateDNA,
  validateProtein,
} from "@/search-validator";
const emit = defineEmits<{
  (e: "search", v: SequenceSearchRequest): void;
}>();

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
</script>
