<template>
  <editor id="tinymce" v-model="textContent" :init="init" :disabled="disabled"></editor>
</template>

<script setup>

import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme' // 主题文件
import 'tinymce/icons/default'
// import 'tinymce/models/dom' //tintmce6必需
// tinymce插件可按自己的需要进行导入
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/importcss' //图片工具
import 'tinymce/plugins/media' // 插入视频插件
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
import 'tinymce/plugins/insertdatetime'//时间插入

//以下只能适配tinymce5
import '@npkg/tinymce-plugins/imagetools'
import '@npkg/tinymce-plugins/axupimgs'
import '@npkg/tinymce-plugins/table'
import '@npkg/tinymce-plugins/importword'
import '@npkg/tinymce-plugins/upfile'

import {onMounted} from "vue";
import axios from "axios";
import {getToken} from "@/utils/auth";

const {proxy} = getCurrentInstance();

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  paste_retain_style_properties: 'all',  //粘贴保留样式属性
  paste_word_valid_elements: '*[*]',        // word需要它
  paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
  paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
  paste_webkit_styles: 'all',
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,

  plugins: {
    type: [String, Array],
    default: 'image imagetools axupimgs table importword  upfile'
  },
  toolbar: {
    type: [String, Array],
    default:
        "image axupimgs table importword  upfile",
  }
})

const upload_param = {
  url: "/dev-api/common/upload",//需替换为真实路径测试
  data: null,
  method: "post",
  bfLoading: true,
  isUploadFile: true,
  withCredentials: false, // true 为不允许带 token, false 为允许
  headers: {'Authorization': 'Bearer ' + getToken()}
}

const init = {
  // width: 720,
  height: 600,
  language_url: '/tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  // 皮肤：这里引入的是public下的资源文件
  skin_url: '/tinymce/skins/ui/oxide',
  // skin_url: 'tinymce/skins/ui/oxide-dark',//黑色系
  content_css: '/tinymce/skins/content/default/content.css', //内容区域css样式
  images_file_types: "jpg,svg,webp",
  plugins: props.plugins,
  toolbar: props.toolbar,
  branding: false,
  selector: '#tinymce',  // change this value according to your HTML
  //启用菜单栏并显示如下项 [文件 编辑 插入 格式 表格]
  menubar: 'file edit insert view format table',
//  menubar: false,
  // 是否显示底部状态栏
  statusbar: true,
  // convert_urls: false,

  // 初始化完成
  init_instance_callback: (editor) => {
    // console.log('init complete：', editor)
  },

  //word文档导入功能
  importword_handler: function (editor, files, next) {
    let file_name = files[0].name;
    if (file_name.substr(file_name.lastIndexOf(".") + 1) == 'docx') {
      editor.notificationManager.open({
        text: '正在转换中...',
        type: 'info',
        closeButton: false,
      });
      next(files);
    } else {
      editor.notificationManager.open({
        text: '目前仅支持docx文件格式，若为doc，请将扩展名改为docx',
        type: 'warning',
      });
    }
    // next(files);
  },
  importword_filter: function (result, insert, message) {
    // 自定义操作部分
    insert(result) //回插函数
  },

  // 图片左侧下方上传(含多图上传)
  images_upload_handler: (blobInfo, success, failure, progress) => {
    if (blobInfo.blob().size / 1024 / 1024 > 2) {
      failure("上传失败，图片大小请控制在 2M 以内")
    } else {
      upload_param.data = new FormData();
      upload_param.data.append("file", blobInfo.blob());
      axios(upload_param).then(res => {
        if (res.data.code == 500) {
          proxy.$modal.alertError(res.data.msg);
        } else {
          success(res.data.url);
        }
      }).catch(err => {
        failure("上传失败");
      });
    }
  },

// 图片上传右侧向上的箭头
  file_picker_callback: (callback, value, meta) => {
    console.log('file_picker_callback')
    //文件分类
    var filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4';
    //为不同插件指定文件类型
    switch (meta.filetype) {
      case 'image':
        filetype = '.jpg, .jpeg, .png, .gif';
        break;
      case 'media':
        filetype = '.mp3, .mp4';
        break;
      case 'file':
      default:
    }
    //模拟出一个input用于添加本地文件
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', filetype);
    input.click();
    input.onchange = function () {
      var file = this.files[0];
      upload_param.data = new FormData();
      upload_param.data.append('file', file);
      axios(upload_param).then(res => {
        if (res.data.code == 500) {
          proxy.$modal.alertError(res.data.msg);
        } else {
          callback(res.data.url);
        }
      }).catch(err => {
        failure("文件上传失败");
      });
    }
  },

  //upfile 图标
  file_callback: function (file, success) {
    console.log("file_callback:")
    if (!file) {
      proxy.$modal.alertError("请选择上传的文件！");
      return;
    }

    upload_param.data = new FormData();
    upload_param.data.append("file", file);
    axios(upload_param).then(res => {
      if (res.data.code == 500) {
        proxy.$modal.alertError(res.data.msg);
      } else {
        success(res.data.url, {text: res.data.originalFilename});
      }
    }).catch(err => {
      // failure("上传失败");
    });
  }

}

let textContent = ref(props.value)

// 组件挂载完毕
onMounted(() => {
  tinymce.init({})
})

// 添加相关的事件
const clear = () => {
  textContent = ''
}

const setContent = (value) => {
  textContent.value = value
}
const getContent = () => {
  return textContent.value
}


defineExpose({setContent, getContent})
</script>


