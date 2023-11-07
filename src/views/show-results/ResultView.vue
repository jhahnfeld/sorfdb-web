<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import usePageState, { State } from "@/PageState";
import { computed, onMounted, ref } from "vue";

import { useApi } from "@/SorfdbApi";
import { useRoute } from "vue-router";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";

const route = useRoute();
const id = computed(() => route.params.id as string);
const api = useApi();
const entry = ref<SorfdbEntry>();

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
      <h2>Dataset: {{ id }}</h2>
    </div>
    <Loading :state="state"> {{ entry }}</Loading>
  </main>
</template>
@/SorfdbApi
