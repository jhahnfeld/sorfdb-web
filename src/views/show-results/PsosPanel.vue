<script setup lang="ts">
import json5 from "json5";
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import { psosResponseScheme, type psosResponse } from "@/model/PsosResponse";
import notificationMessage from "@/components/Notification.vue";
import { ref, type PropType } from "vue";
const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});
const error = ref("");

function toJson(r: Response) {
  if (!r.ok)
    return r
      .text()
      .then((t) => Promise.reject(`${r.status}: ${r.statusText}\n${t}`));
  return r.text().then(json5.parse);
}
async function sendPsosRequest(protein: string) {
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
  try {
    const response = await fetch(request);
    const responseBody = await toJson(response);
    return responseBody;
  } catch (e) {
    console.log(e);
    return e;
  }
  //return fetch(request).then((x) => {
  //  return toJson(x);
  //});
  //.then((j) => psosResponseScheme.parse(j));
}
async function getPsosId(protein: string) {
  const psosJson = await sendPsosRequest(protein);
  console.log(psosJson.id);
  return psosJson.id;
}

async function openPsos(protein: string) {
  const psosId = await getPsosId(protein);
  window.open("https://psos.computational.bio/psov2/".concat(psosId));
}
</script>

<template>
  <div class="py-2">
    <button
      type="button"
      class="btn btn-primary"
      @click="openPsos(entry.protein)"
    >
      Send to PSOS
    </button>
    <notificationMessage :message="error" />
  </div>
</template>
