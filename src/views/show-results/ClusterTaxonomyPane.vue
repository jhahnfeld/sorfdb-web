<script setup lang="ts">
import Plotly from "plotly.js-dist-min";
import type { ClusterEntry } from "@/model/ClusterSearchResult.ts";
import { onMounted, ref, type PropType } from "vue";

const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<ClusterEntry>, required: true },
});

function formatTaxonomyForPlotly(
  taxonomy: {
    id: number;
    value: number;
    label: string;
    rank: string;
    parent: number | null;
  }[],
) {
  const data: {
    type: string;
    labels: string[];
    parents: string[];
    values: number[];
    outsidetextfont: {
      size: number;
      color: string;
    };
    leaf: {
      opacity: number;
    };
    marker: {
      line: {
        width: number;
      };
    };
    branchvalues: string;
  } = {
    type: "sunburst",
    labels: [],
    parents: [],
    values: [],
    outsidetextfont: { size: 20, color: "#377eb8" },
    leaf: { opacity: 0.4 },
    marker: { line: { width: 2 } },
    branchvalues: "total",
  };

  const parentMap: Map<number | null, string> = new Map([[null, ""]]);

  for (const level of taxonomy) {
    if (
      level.label !== null &&
      Array.from(parentMap.values()).includes(level.label)
    ) {
      let isUnique: boolean = false;
      let tmpLabel: string = level.label + "*";
      while (!isUnique) {
        if (Array.from(parentMap.values()).includes(tmpLabel)) {
          tmpLabel = tmpLabel + "*";
        } else {
          parentMap.set(level.id, tmpLabel);
          data.labels.push(tmpLabel);
          isUnique = true;
        }
      }
    } else {
      parentMap.set(level.id, level.label);
      data.labels.push(level.label);
    }
    data.parents.push(parentMap.get(level.parent));
    data.values.push(level.value);
  }

  for (let i = data.labels.length; i > 0; i--) {
    const parent: string = data.parents[i];
    const parentIndex: number = data.labels.indexOf(parent);
    let cumValue: number = 0;
    for (let j = 0; j <= data.parents.length; j++) {
      if (data.parents[j] == parent) {
        cumValue = cumValue + data.values[j];
      }
    }
    if (data.values[parentIndex] < cumValue) {
      data.values[parentIndex] = cumValue;
    }
  }

  return [data];
}

const plot = ref();

onMounted(() => {
  const data = formatTaxonomyForPlotly(props.entry.statistics.taxonomy);
  const layout = {
    margin: { l: 0, r: 0, b: 0, t: 0 },
    width: 500,
    height: 500,
  };
  Plotly.newPlot(plot.value, data, layout);
});
</script>

<template>
  <div align="center" ref="plot"></div>
</template>
