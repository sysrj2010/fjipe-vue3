<template>
  <div class="scroll-y">
    <Tinymce ref="refTinymce"  v-model="articleContent"/>

    <el-button type="primary" @click="getHtml">Primary</el-button>
  </div>

</template>

<script setup>
  import Tinymce from "@/components/Tinymce/index.vue";
  const {proxy} = getCurrentInstance();

  const articleContent = ref(null);

  function getHtml()
  {
    console.log(proxy.$refs["refTinymce"].getContent());
  }
</script>
