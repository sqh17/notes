<template>
  <div>
    <div v-for="item in arr">
      <img width="200" height="400" :data-index="item" v-lazy="item">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {Directive} from 'vue'
// glob 懒加载模式
// 这模式可以分包
// let modules = {
//   'xxx': () => import('xxx')
// }
// globEager 静态加载模式
// import xx from 'xx'

const images: Record<string, {default: string}> = import.meta.glob('./assets/images/*.*',{
  eager: true
})
const arr = Object.values(images).map(v=>v.default)
const vLazy:Directive<HTMLImageElement, string> = async (el, binding) => {
  // 做过渡的图片，就是真实图片还没渲染的时候，用这个图片过渡
  let def = await import('./assets/xxx.png')
  el.src = def.default
  let observer = new IntersectionObserver((entries)=>{
    if(entries[0].intersectionRatio > 0 && entries[0].isIntersecting){
      el.src = binding.value
      observer.unobserve(el)
    }
  })
  observer.observe(el)
}
</script>

<style lang='scss' scoped>

</style>