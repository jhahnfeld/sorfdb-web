<script setup lang="ts">
import type { SorfdbEntry } from "@/model/SorfdbSearchResult";
import { psosResponseScheme, type psosResponse } from "@/model/PsosResponse";
import notificationMessage from "@/components/Notification.vue";
import { ref, type PropType } from "vue";
import { openPsos } from "@/PsosApi";

const props = defineProps({
  id: { type: String },
  entry: { type: Object as PropType<SorfdbEntry>, required: true },
});

const error = ref("");
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
