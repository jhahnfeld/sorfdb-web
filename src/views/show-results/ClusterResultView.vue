<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import usePageState, { State } from "@/PageState";
import { computed, onMounted, ref } from "vue";
import { useClusterApi as useApi } from "@/SorfdbApi";
import { useRoute } from "vue-router";
import SummaryPane from "@/views/show-results/ClusterSummaryPane.vue";
import type { ClusterEntry } from "@/model/ClusterSearchResult.ts";

const route = useRoute();
const id = computed(() => route.params.id as string);
const api = useApi();
const entry = ref<ClusterEntry>();

function loadData() {
  api.entry(id.value).then((x) => {
    state.value.setState(State.Main);
    entry.value = x;
  });
}

onMounted(loadData);

const state = usePageState();
state.value.setState(State.Loading);
</script>

<template>
  <main class="container">
    <div class="row">
      <h2>Small protein family: {{ id }}</h2>
    </div>
    <Loading :state="state">
      <SummaryPane v-if="entry" :id="id" :entry="entry" />
    </Loading>
  </main>
</template>
@/SorfdbApi
