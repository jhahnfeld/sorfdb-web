<script setup lang="ts">
import json5 from "json5";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import notificationMessage from "@/components/Notification.vue";
import { ref, type PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});
const error = ref("");
const psosResponse = ref(undefined);
const psosId = ref("");

interface psosResponse {
  id: string;
  created: string;
  lastUpdated: string;
  deleteAt: string;
  step: string;
  request: {
    type: string;
    configuration: {
      profile: string;
    };
    sequence: string;
  };
  files: [
    {
      location: string;
      name: string;
      type: string;
    },
  ];
  state: {
    name: string;
    type: string;
  };
}

function toJson(r: Response): Promise<JSON> {
  if (!r.ok)
    return r
      .text()
      .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
  return r.text().then(json5.parse);
}
function sendPsosRequest(protein: string): psosResponse {
  const headers: Headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  const request: RequestInfo = new Request(
    "https://psos.computational.bio/api/v1/job/submit",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        configuration: { profile: "bacteria-gram+" },
        sequence: protein,
      }),
    },
  );

  fetch(request)
    .then((x) => {
      return toJson(x);
    })
    .catch((error) => {
      console.error("Promise rejected with error: " + error);
    });
  fetch(request).then((x) => {
    return toJson(x);
  });
}
function getPsosId(protein: string) {
  const psosJson = sendPsosRequest(protein);
  //psosId.value = psosJson;
  console.log(psosJson);
  console.log(psosId.value);
}
</script>

<template>
  <div class="py-2">
    <button
      type="button"
      class="btn btn-primary"
      @click="getPsosId(entry.protein)"
    >
      Send to PSOS
    </button>
    <notificationMessage :message="error" />
  </div>
</template>
