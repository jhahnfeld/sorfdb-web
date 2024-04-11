<template>
  <div>
    <ul class="nav nav-pills py-3">
      <li class="nav-item" v-for="item in tabs" :key="item.id">
        <button
          class="nav-link"
          :class="{ active: currentTab === item.id }"
          @click="updateTab(item.id)"
        >
          <h3>{{ item.name }}</h3>
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, type Ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  namePrefix: { type: String, required: true },
});
const router = useRouter();
const route = useRoute();

const currentTab = computed(() => {
  // assumption: path contains either family or sequence
  if (route.path.match(/family/)) return "family";
  if (route.path.match(/sequence/)) return "sequence";
  return "";
});

export type Tab = { id: string; name: string };

const tabs: Tab[] = [
  { id: "sequence", name: "Sequences" },
  { id: "family", name: "Families" },
];

function updateTab(newTab: string) {
  const newRouteName = `${props.namePrefix}-${newTab}`;
  router.push({ name: newRouteName });
}
</script>
