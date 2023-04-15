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
import 'tinymce/plugins/image';// 插入上传图片插件
import 'tinymce/plugins/media';// 插入视频插件
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/lists';// 列表插件,有序列表、无序列表
import 'tinymce/plugins/wordcount';// 字数统计插件
import 'tinymce/plugins/preview'// 插入预览
import 'tinymce/plugins/code'// 插入代码
import 'tinymce/plugins/link'// 插入链接
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/codesample';  //插入、编辑代码示例
import 'tinymce/plugins/hr';  //水平分割线
import 'tinymce/plugins/fullscreen';  //全屏
import 'tinymce/plugins/searchreplace';  //查找和替换
import "tinymce/plugins/charmap";  //特殊符号
import "tinymce/plugins/insertdatetime";  //插入时间、日期
import "tinymce/plugins/imagetools";  //自定义图像
import 'tinymce/plugins/anchor';  //插入锚点
import '@npkg/tinymce-plugins/upfile';//文件上传
import '@npkg/tinymce-plugins/table';//增强表格
import '@npkg/tinymce-plugins/axupimgs';//多图上传
import '@npkg/tinymce-plugins/importword';//导入表格

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
    default: "preview searchreplace " +
        "fullscreen image axupimgs link media   table  hr " +
        " insertdatetime advlist lists wordcount imagetools  " +
        " axupimgs importword  upfile"
  },
  toolbar: {
    type: [String, Array],
    default:
    "fullscreen source preview | undo redo  \
       | forecolor backcolor bold italic underline \
       | table image axupimgs media importword  upfile\
       | alignleft aligncenter alignright alignjustify outdent indent lineheight \
       | bullist numlist |  link charmap hr insertdatetime \ "
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

  content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,
  //字号设置
  fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',  //字体大小
  //字体设置 //字体样式
  font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,
  lineheight_formats: "0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5",  //行高配置，也可配置成"12px 14px 16px 20px"这种形式

  paste_retain_style_properties: 'all',  //粘贴保留样式属性
  paste_word_valid_elements: '*[*]',        // word需要它
  paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
  paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
  paste_webkit_styles: 'all',
  paste_merge_formats: true,
  paste_auto_cleanup_on_paste: false,

  default_link_target: '_blank',
  link_title:false, //取消link工具的标题

  // start-格式栏设置设置-CONFIG: StyleSelect
  style_formats: [
    {
      title: '首行缩进',
      block: 'p',
      styles: { 'text-indent': '2em' }
    },
    {
      title: '行高',
      items: [
        { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
        { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
        { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
        { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
        { title: '3', styles: { 'line-height': '3' }, inline: 'span' }
      ]
    }
  ],
  // end-格式栏设置设置
  // Tab
  tabfocus_elements: ':prev,:next',
  object_resizing: true,
  // Image
  imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',

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


