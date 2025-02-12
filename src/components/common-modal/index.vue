<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <header class="modal-header">
        <slot name="header"></slot>
      </header>
      <section class="modal-body">
        <slot name="body"></slot>
      </section>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isVisible"]);

const visible = ref(props.isVisible);

watch(() => props.isVisible, (newValue) => {
  visible.value = newValue;
});

const close = () => {
  visible.value = false;
  emit("update:isVisible", false);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  padding: 20px;
}

.modal-header {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
}

.modal-body {
  padding: 10px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>
