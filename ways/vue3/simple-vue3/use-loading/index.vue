<template>
  <div v-if="isShow" class="loading">
      <div class="loading-content">Loading...</div>
  </div>
</template>
  
<script setup lang='ts'>
import { ref } from 'vue';
const isShow = ref(false) //定位loading 的开关

const show = () => {
  isShow.value = true
}
const hide = () => {
  isShow.value = false
}
//对外暴露 当前组件的属性和方法
defineExpose({
  isShow,
  show,
  hide
})
</script>


  
<style scoped lang="less">
.loading {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  &-content {
      font-size: 30px;
      color: #fff;
  }
}
</style>