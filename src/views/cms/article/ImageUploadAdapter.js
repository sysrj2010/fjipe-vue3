import axios from "axios";
import { getToken } from "@/utils/auth";

/**
 * 自定义上传图片插件
 */
class ImageUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    async upload() {
        const data = new FormData();

        data.append("file", await this.loader.file);
        const res = await axios({
            //url: process.env.VUE_APP_BASE_URL + `/common/upload`,
            url: "http://192.168.0.200:8080/common/upload",
            method: "POST",
            data,
            withCredentials: false, // true 为不允许带 token, false 为允许
            headers: { 'Authorization': 'Bearer ' + getToken() }
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

export default ImageUploadAdapter;
