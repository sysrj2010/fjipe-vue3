import { login, logout, getInfo, getPublicKey} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/photo.png'
import {encrypt,decrypt} from "../../api/tool/jsencrypt";

const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      permissions: []
    }),
    actions: {
      //获取公钥
      getPublicKey() {
        return new Promise((resolve, reject) => {
          getPublicKey()
              .then(res => {
                resolve(res)
              })
              .catch(error => {
                reject(error)
              })
        })
      },
      // 登录
      login(userInfo) {
        return new Promise((resolve, reject) => {
          getPublicKey().then(res => {
            const username = userInfo.username.trim()
            //调用加密方法(传密码和公钥)
            let password = encrypt(res.publicKey,userInfo.password)
            const code = userInfo.code
            const uuid = userInfo.uuid
            login(username, password, code, uuid).then(res => {
                  setToken(res.token)
                  this.token = res.token
                  resolve()
                })
                .catch(error => {
                  reject(error)
                })
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            const user = res.user
            const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.avatar = avatar;
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useUserStore
