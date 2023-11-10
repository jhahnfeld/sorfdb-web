<script setup lang="ts">
import type { PropType } from "vue";
import DisplayMetadata from "./DisplayMetadata.vue";
import PhylogenyTree from "@/components/PhylogenyTree.vue";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";

const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});
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
    <div class="col-lg-6 col-md-12">
      <div class="card h-100">
        <div class="card-header">Protein analysis</div>
        <div class="card-body">
          <!--TODO add psos link-->
        </div>
      </div>
    </div>
  </div>
</template>
