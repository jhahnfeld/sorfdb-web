<template>
  <div class="form-check" v-for="option in options" :key="option.key">
    <input
      class="form-check-input"
      type="checkbox"
      :id="id + option.key"
      :value="option"
      v-model="selection"
    />
    <label class="form-check-label" :for="id + option.key">
      {{ option.label }}
    </label>
  </div>
</template>
<script setup lang="ts">
import { ref, type PropType, computed } from "vue";
import { v4 } from "uuid";
import { type Option } from "./CheckboxOption";

const id = ref(v4());

const props = defineProps({
  modelValue: { type: Array as PropType<Option[]>, required: true },
  options: { type: Array as PropType<Option[]>, required: true },
});

const selection = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const emit = defineEmits<{
  (e: "update:modelValue", v: Option[]): void;
}>();
</script>
