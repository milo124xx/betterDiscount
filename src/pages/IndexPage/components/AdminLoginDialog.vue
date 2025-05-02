<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">管理员登录</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="adminPassword" filled :type="isPwd ? 'password' : 'text'" label="请输入管理员密码" lazy-rules>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" @click="onCancel" />
        <q-btn flat label="确认" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login'])

const adminPassword = ref('')
const isPwd = ref(true)

// 计算属性：dialog 显示状态
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 取消登录
function onCancel() {
  adminPassword.value = ''
  emit('update:modelValue', false)
}

// 确认登录
function onConfirm() {
  emit('login', adminPassword.value)
  adminPassword.value = ''
}
</script>
