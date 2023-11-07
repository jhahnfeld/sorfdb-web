<template>
  <div v-for="(entry, index) in entries" :key="index" :title="entry.level">
    <a
      :style="{ 'margin-left': index + 'rem' }"
      :href="entry.url"
      target="_blank"
    >
      {{ entry.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});

const mapping: Record<string, string> = {
  domain: "d__",
  phylum: "p__",
  class: "c__",
  order: "o__",
  family: "f__",
  genus: "g__",
  species: "s__",
};

type TreeEntry = {
  url: string;
  level: string;
  label: string;
};

function toEntry(level: string, value: string): TreeEntry {
  if (!(level in mapping)) throw `Unsupported taxonomy level: ${level}`;
  return {
    url: "https://gtdb.ecogenomic.org/tree?r=" + mapping[level] + value,
    level: level,
    label: value,
  };
}

const entries = computed(() => {
  const c = props.entry;
  return [
    toEntry("domain", "Bacteria"),
    toEntry("phylum", c.phylum ? c.phylum : ""),
    toEntry("class", c.class ? c.class : ""),
    toEntry("order", c.order ? c.order : ""),
    toEntry("family", c.family ? c.family : ""),
    toEntry("genus", c.genus ? c.genus : ""),
    toEntry("species", c.species ? c.species : ""),
    toEntry("strain", c.strain ? c.strain : ""),
  ];
});
</script>
