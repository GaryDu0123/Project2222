axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
})

window.onload = function(){
    const submitButton = document.querySelector('#submitButton')
    submitButton.onclick = function(){
        initSubmitButton()
    };
}

function usernameCheck(){
    const username = document.querySelector("#username");
    const usernameValue = username.value;
    return usernameValue.length >= 1;

}

function getNext() {
    // https://blog.csdn.net/kongjiea/article/details/39644623
    function GetRequest() {
        const url = location.search; //获取url中"?"符后的字串
        const theRequest = {};
        if (url.indexOf("?") !== -1) {
            const str = url.substr(1);
            let strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    let retList = GetRequest()
    if (retList.next !== undefined){
        return retList.next
     }else{
        return null;
    }
}

function initSubmitButton(){
    const username = document.querySelector('#username')
    const password = document.querySelector("#password")
    const publicKey = document.querySelector('#public_key')
    if (!usernameCheck()){
        return
    }
    if (publicKey === null){
        console.error("Public Key Not Found")
        return;
    }
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey.value) // 设置公钥

    let param = new URLSearchParams()
    let profile_info = {
        'username': username.value,
        'password': password.value,
    }

    param.append("key", encryptor.encrypt(JSON.stringify(profile_info)));
    param.append('timestamp', new Date().getTime().toString());
    axios.post('/login', param)
        .then(function (response) {
            if (response.status === 200){
                let nextHref = getNext();
                if (getNext() !== null) {
                    window.location.href = nextHref;
                } else {
                    window.location.href = '/chat/index';
                }
            } else {
                window.location.href = '/login';
            }

        })
        .catch(function (error) {
            console.log(error);
            // window.location.href = '/login'

    });
}

