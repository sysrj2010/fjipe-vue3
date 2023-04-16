<template>
  <router-view/>
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import {handleThemeStyle} from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>

<style>
  /* tinymce 富文本菜单 2020+是el弹出消息 ，已把弹出的dialog（add/update）降为1000*/
  .tox-tinymce-aux {
    z-index: 2010 !important;
  }

  .tox-dialog{
    z-index: 2020 !important;
  }

</style>
