<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import usePageState, { State } from "@/PageState";
import { computed, onMounted } from "vue";

import { useApi } from "@/SorfdbApi";
import { useRoute } from "vue-router";

const route = useRoute();
const id = computed(() => route.params.id as string);
const api = useApi();

function loadData() {}

onMounted(loadData);

const state = usePageState();
state.value.setState(State.Loading);
</script>

<template>
  <main class="container">
    <div class="row">
      <h2>Dataset: {{ id }}</h2>
    </div>
    <Loading :state="state"> </Loading>
  </main>
</template>
@/SorfdbApi
