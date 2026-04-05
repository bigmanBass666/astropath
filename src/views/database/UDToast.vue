<template>
  <Teleport to="body">
    <Transition name="toast-fade">
      <div
        v-if="toast.visible"
        class="ud-toast"
        :class="'ud-toast--' + toast.type"
      >
        <span class="ud-toast__icon">{{ toastIcons[toast.type] }}</span>
        <span class="ud-toast__msg">{{ toast.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  toast: { visible: boolean; message: string; type: string }
  toastIcons: Record<string, string>
}>()
</script>
