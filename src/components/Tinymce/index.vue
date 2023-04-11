<script setup>
//import axiosReq from '@/utils/axiosReq.js'
import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme' // 主题文件
import 'tinymce/icons/default'
import 'tinymce/models/dom'
// tinymce插件可按自己的需要进行导入
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/importcss' //图片工具
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/codesample' // 插入代码
import 'tinymce/plugins/code' // 查看源码
import 'tinymce/plugins/link' //
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/template' //插入模板
import 'tinymce/plugins/save' // 保存
import 'tinymce/plugins/searchreplace' //查询替换
import 'tinymce/plugins/pagebreak' //分页
import 'tinymce/plugins/insertdatetime'
import {onMounted} from "vue"; //时间插入

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },

  plugins: {
    type: [String, Array],
     default: 'lists image media table wordcount save preview'
  },
  toolbar: {
    type: [String, Array],
    default:
      "lists image media table wordcount save preview",
  }
})

const init = {
  // width: 720,
  height: 400,
  language_url: '/tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  // 皮肤：这里引入的是public下的资源文件
  skin_url: '/tinymce/skins/ui/oxide',
  // skin_url: 'tinymce/skins/ui/oxide-dark',//黑色系
  content_css: '/tinymce/skins/content/default/content.css', //内容区域css样式
  // images_file_types: "jpg,svg,webp",
  // images_upload_url: "xxxxxxxxxxxxx",//系统默认配置的自动上传路径，需替换为真实路径测试
  plugins: props.plugins,
  toolbar: props.toolbar,
  branding: false,
  selector: '#tinymce',  // change this value according to your HTML
  //启用菜单栏并显示如下项 [文件 编辑 插入 格式 表格]
//  menubar: 'file edit insert view format table',
  menubar: false,
  // 是否显示底部状态栏
  statusbar: true,
  // convert_urls: false,
  // 初始化完成
  init_instance_callback: (editor) => {
    console.log('init complete：', editor)
  }
  // 此处为自定义图片上传处理函数
  // images_upload_handler: (blobInfo, progress) => {
  //   console.log("图片上传处理：", blobInfo.blob());
  //   const formData = new FormData();
  //   formData.append("file", blobInfo.blob());
  //   axiosReq({
  //     url: "xxxxxxxxxxx",//需替换为真实路径测试
  //     data: formData,
  //     method: "post",
  //     bfLoading: true,
  //     isUploadFile: true,
  //   }).then((res) => {
  //     console.log(res);
  //   });
  // },
}
let textContent = ref(props.value)

// 组件挂载完毕
onMounted(() => {
  tinymce.init({})
})

// 添加相关的事件,https://github.com/tinymce/tinymce-vueevents
const clear = () => {
  textContent = ''
}

const setContent = (value) => {
  textContent.value = value
}
const getContent = () => {
  return textContent.value
}
defineExpose({ setContent, getContent })
</script>
<template>
  <editor id="tinymce" v-model="textContent" :init="init" :disabled="disabled"></editor>
</template>
