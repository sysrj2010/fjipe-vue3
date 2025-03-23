import JSEncrypt from 'jsencrypt'

// RSA加密
export function encrypt(publicKey, data) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(data) // 对数据
}


// RSA解密（如果需要在前端解密）
export function decrypt(privateKey, data) {
    const decryptor = new JSEncrypt()
    decryptor.setPrivateKey(privateKey)
    return decryptor.decrypt(data)
}


