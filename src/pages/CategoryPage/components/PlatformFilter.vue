<template>
  <div class="platform-filter-component q-mb-md">
    <div class="platform-buttons row q-gutter-x-sm">
      <q-btn
        v-for="platform in platformOptions"
        :key="platform.value"
        :label="platform.label"
        :color="selectedPlatform === platform.value ? platform.activeColor : 'white'"
        :text-color="selectedPlatform === platform.value ? 'white' : platform.textColor"
        :class="['platform-btn', selectedPlatform === platform.value ? 'active' : '']"
        @click="$emit('update:platform', platform.value)"
        unelevated
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
// 组件名称定义
defineOptions({
  name: 'PlatformFilterComponent'
})

// 定义属性
defineProps({
  selectedPlatform: {
    type: String,
    required: true
  },
  platformOptions: {
    type: Array,
    required: true
  }
})

// 定义事件
defineEmits(['update:platform'])
</script>

<style lang="scss" scoped>
.platform-filter-component {
  .platform-buttons {
    flex-wrap: wrap;
  }

  .platform-btn {
    margin-bottom: 8px;
    border: 1px solid #e0e0e0;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;

    &.active {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
}

@media (max-width: 599px) {
  .platform-filter-component {
    .platform-btn {
      padding: 4px 8px;
      font-size: 12px;
    }
  }
}
</style>
