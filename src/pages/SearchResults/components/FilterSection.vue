<template>
  <div class="filter-section q-mb-lg">
    <div class="row items-center justify-between">
      <div class="platform-filter">
        <div class="platform-buttons row q-gutter-x-sm">
          <q-btn v-for="platform in platformOptions" :key="platform.value" :label="platform.label"
            :color="selectedPlatform === platform.value ? platform.activeColor : 'white'"
            :text-color="selectedPlatform === platform.value ? 'white' : platform.textColor"
            :class="['platform-btn', selectedPlatform === platform.value ? 'active' : '']"
            @click="handlePlatformChange(platform.value)" unelevated no-caps />
        </div>
      </div>
      <div class="sort-filter">
        <q-btn-dropdown color="primary" :label="currentSortLabel" unelevated class="sort-dropdown">
          <q-list>
            <q-item v-for="option in sortOptions" :key="option.value" clickable v-close-popup
              @click="handleSortChange(option.value)">
              <q-item-section>
                <q-item-label>{{ option.label }}</q-item-label>
              </q-item-section>
              <q-item-section avatar v-if="sortBy === option.value">
                <q-icon name="check" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedPlatform: {
    type: String,
    required: true
  },
  sortBy: {
    type: String,
    required: true
  },
  platformOptions: {
    type: Array,
    required: true
  },
  sortOptions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:platform', 'update:sort'])

const currentSortLabel = computed(() => {
  return props.sortOptions.find(option => option.value === props.sortBy)?.label || '默认排序'
})

function handlePlatformChange(value) {
  emit('update:platform', value)
}

function handleSortChange(value) {
  emit('update:sort', value)
}
</script>
