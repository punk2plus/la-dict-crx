import axios from 'axios'

function dealResponse(res) {
    const status = res.errorCode
    const respond = res
    // 后端会将错误文案放在message里面
    switch (+status) {
        case 0:
            delete respond.errorCode
            return res
        default:
            return {
                text: res.message,
                code: status
            }
    }
}

function request(options) {
    return axios(options)
        .then(res => {
            const { data } = res
            return dealResponse(data)
        })
        .catch(error => Promise.reject(error))
}
export default request
