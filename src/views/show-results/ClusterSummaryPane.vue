<script setup lang="ts">
import type { PropType } from "vue";
import DisplayData from "./ClusterData.vue";
import ClusterStatistic from "./ClusterStatistic.vue";
import Krona from "./ClusterTaxonomyPane.vue";
import MsaPane from "./ClusterMsaPane.vue";
import type { ClusterEntry } from "@/model/ClusterSearchResult.ts";

const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<ClusterEntry>, required: true },
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
          <DisplayData :entry="entry" />
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-md-12">
      <div class="card h-100">
        <div class="card-header">Statistics</div>
        <div class="card-body">
          <ClusterStatistic :entry="entry" />
        </div>
      </div>
    </div>
  </div>

  <div class="row my-3 gx-2 gy-2">
    <div class="col-lg-12 col-md-12">
      <div class="card h-100">
        <div class="card-header">Taxonomy</div>
        <div class="card-body">
          <Krona :entry="entry" />
        </div>
      </div>
    </div>
  </div>

  <div class="col-lg-12 col-md-12">
    <div class="card h-100">
      <div class="card-header">
        Multiple sequence alignment
        <span class="float-end">
          <button
            type="button"
            class="btn btn-secondary"
            @click="copyToClipboard(entry.alignment)"
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
        </span>
      </div>
      <div class="card-body">
        <MsaPane :entry="entry" />
      </div>
    </div>
  </div>
</template>
