<!-- src/components/app/AppSelect.vue -->
<script setup lang="ts">
const model = defineModel({type: [String, Number]})

defineProps({
  id: {type: String, required: true},
  label: {type: String, required: true},
  options: {
    type: Array as () => { label: string; value: string | number }[],
    required: true
  },
  isInvalid: {type: Boolean, default: false},
  invalidFeedback: {type: String, default: 'This field is required'}
})
</script>

<template>

  <div class="col-md-4" style="margin-bottom: 10px">
    <label class="form-label" :for="id">{{ label }}</label>

    <select :id="id"
            class="form-select"
            :class="{'is-invalid': isInvalid}"
            v-model="model">
      <option disabled :value="null" selected>Please select an option</option>
      <option
          v-for="option in options"
          :key="option.value"
          :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div class="invalid-feedback">{{ invalidFeedback }}</div>
  </div>
</template>
