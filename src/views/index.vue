<template>
  <div id="app">
    <!-- 工具栏容器 -->
    <div id="toolbar-container"></div>
    <!-- 编辑器容器 -->
    <div id="editor"></div>

    <el-button @click="getData" type="primary">主要按钮</el-button>

  </div>
</template>

<script>

import CKEditor from 'my-ckeditor5-classic';
import axios from "axios";
import {getToken} from "@/utils/auth";

export default {
  data() {
    editor: null
  },
  mounted() {
    this.initCKEditor()
  },
  methods: {

    getData() {
      let html = this.editor.getData();
      alert(html);
      let text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      alert(text);
    },

    initCKEditor() {
      class UploadAdapter {
        constructor(loader) {
          this.loader = loader
        }

        async upload() {  // 图片上传
          const data = new FormData();
          data.append('file', await this.loader.file);
          const res = await axios({
            url: "http://192.168.0.200:8080/common/upload",
            method: "POST",
            data,
            withCredentials: false, // true 为不允许带 token, false 为允许
            headers: {'Authorization': 'Bearer ' + getToken()}
          });
          console.log(res.data);
          // 后台返回数据：
          // {"code":0,"msg":"success","data":{"url":"/upload/struts2.jpeg"}}
          // 方法返回数据格式： {default: "url"}
          return {
            default: res.data.url,
          };
        }
      }

      CKEditor.create(document.querySelector('#editor'), {
        toolbar: {
          shouldNotGroupWhenFull: true,
          items: ['heading', '|', 'bold', 'italic', 'underline', 'strikethrough', 'code', 'link', '|', 'numberedList', 'bulletedList', '|', 'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|', 'outdent', 'indent', '|',
            'blockQuote', 'alignment', 'insertImage', 'mediaEmbed', 'insertTable', 'horizontalLine', 'specialCharacters', '|', 'undo', 'redo', 'subscript', 'superscript', 'findAndReplace', 'highlight', 'removeFormat', 'selectAll',]
        },
        heading: {
          options: [
            {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
            {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
            {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
            {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'}
          ]
        },
        fontFamily: {
          options: [
            "default", "宋体", "仿宋", "微软雅黑", "楷体", "黑体", "Arial, Helvetica, sans-serif",
            "Courier New, Courier, monospace", "Georgia, serif", "Lucida Sans Unicode, Lucida Grande, sans-serif",
            "Tahoma, Geneva, sans-serif", "Times New Roman, Times, serif",]
        },
        fontSize: {
          options: [9, 11, 12, "default", 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,],
          highlight: {
            options: [
              {
                model: 'greenMarker',
                class: 'marker-green',
                title: 'Green marker',
                color: 'var(--ck-highlight-marker-green)',
                type: 'marker'
              },
              {model: 'redPen', class: 'pen-red', title: 'Red pen', color: 'var(--ck-highlight-pen-red)', type: 'pen'}]
          },
          supportAllValues: true
        },
        alignment: {
          options: ['left', 'center', 'right']
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'toggleTableCaption', 'tableProperties', 'tableCellProperties']
        },
        ckfinder: {
          'uploaded': 1, 'url': '/'
        },
        link: {
          addTargetToExternalLinks: true,
        }, // a标签跳转打开新窗口
        mediaEmbed: {   // 视频配置
          providers: [
            {
              name: 'myprovider',
              url: [
                /^lizzy.*\.com.*\/media\/(\w+)/,
                /^www\.lizzy.*/,
                /(http|https):\/\/([\w.]+\/?)\S*/
              ],
              html: match => {
                //获取媒体url
                const input = match['input'];
                return (
                    '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 70%;">' +
                    `<iframe src="${input}" ` +
                    'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                    'frameborder="0" allowtransparency="true" allow="encrypted-media">' +
                    '</iframe>' +
                    '</div>'
                );
              }
            }
          ]
        }
      }).then(editor => {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return new UploadAdapter(loader);
        };
        const toolbarContainer = document.querySelector('#toolbar-container');
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        this.editor = editor
      })
    },
  }
}

</script>
