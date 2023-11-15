<script setup lang="ts">
import type { PropType } from "vue";
import DisplayMetadata from "./DisplayMetadata.vue";
import PhylogenyTree from "@/components/PhylogenyTree.vue";
import PsosPanel from "./PsosPanel.vue";
import SequenceFeatures from "./SequenceFeatures.vue";
import ProteinDescriptors from "./ProteinDescriptors.vue";
import SequencePane from "./SequencePane.vue";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";

const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});
const clipBoardPath1: string =
  "M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z";
const clipBoardPath2: string =
  "M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z";

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="row gx-2 gy-2">
    <div class="col-lg-6 col-md-12">
      <div class="card h-100">
        <div class="card-header">Metadata</div>
        <div class="card-body">
          <DisplayMetadata :entry="entry" />
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-md-12">
      <div class="card h-100">
        <div class="card-header">Phylogeny</div>
        <div class="card-body">
          <PhylogenyTree :entry="entry" />
        </div>
      </div>
    </div>
  </div>
  <div class="row my-3 gx-2 gy-2">
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Protein sequence observation service PSOS</div>
        <div class="card-body">
          PSOS provides analysis tools and databases for the more comprehensive
          analysis of protein sequences, such as DbXrefs.
          <PsosPanel :entry="entry" />
        </div>
      </div>
    </div>
    <div class="col-lg-8 col-md-12">
      <div class="card h-100">
        <div class="card-header">Sequence features</div>
        <div class="card-body">
          <SequenceFeatures :entry="entry" />
        </div>
      </div>
    </div>
  </div>
  <div class="row my-3 gx-2 gy-2">
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Sequence features</div>
        <div class="card-body">
          <ProteinDescriptors :entry="entry" />
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-12">
      <div class="card h-100">
        <div class="card-header">Protein sequence observation service PSOS</div>
        <div class="card-body">
          PSOS provides analysis tools and databases for the more comprehensive
          analysis of protein sequences, such as DbXrefs.
          <PsosPanel :entry="entry" />
        </div>
      </div>
    </div>
  </div>
  <div class="row my-3 gx-2 gy-2">
    <div class="col-lg-12 col-md-12">
      <div class="card h-100">
        <div class="card-header">
          Protein sequence
          <button
            type="button"
            class="btn btn-secondary"
            @click="copyToClipboard(entry.protein)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-clipboard"
              viewBox="0 0 16 16"
            >
              <path :d="clipBoardPath1" />
              <path :d="clipBoardPath2" />
            </svg>
          </button>
        </div>
        <div class="card-body">
          <SequencePane :entry="entry" keyword="protein" />
        </div>
      </div>
    </div>
  </div>
  <div class="row my-3 gx-2 gy-2"></div>
  <div class="col-lg-12 col-md-12">
    <div class="card h-100">
      <div class="card-header">
        Nucleotide sequence
        <button
          type="button"
          class="btn btn-secondary"
          @click="copyToClipboard(entry.sorf)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-clipboard"
            viewBox="0 0 16 16"
          >
            <path :d="clipBoardPath1" />
            <path :d="clipBoardPath2" />
          </svg>
        </button>
      </div>
      <div class="card-body">
        <SequencePane :entry="entry" keyword="sorf" />
      </div>
    </div>
  </div>
</template>
