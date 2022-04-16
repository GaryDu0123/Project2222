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


// 判断输入值和二次输入值是否相同
function inputBoxCheck(){
    const passwordCheckBox = document.querySelector("#passwordCheckBox");
    const password = document.querySelector("#password");
    return passwordCheckBox.value === password.value;
}

// 判断用户名是否不为空
function usernameCheck(){
    const username = document.querySelector("#username");
    const usernameValue = username.value;
    return usernameValue.length >= 1;

}

function checkAll(){
    return inputBoxCheck() && usernameCheck()
}


function initSubmitButton(){
    const username = document.querySelector('#username')
    const password = document.querySelector("#password")
    const passwordCheckBox = document.querySelector('#passwordCheckBox')
    const publicKey = document.querySelector('#public_key')
    if (!checkAll()){
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
        'passwordCheckBox': passwordCheckBox.value
    }

    param.append("key", encryptor.encrypt(JSON.stringify(profile_info)));
    param.append('timestamp', new Date().getTime().toString());
    axios.post('/register', param)
        .then(function (response) {
            console.log(response);
            if (response.status === 200){
                window.location.href = '/chat/index'
            } else {
                window.location.href = '/register'
            }

        })
        .catch(function (error) {
            console.log(error);
            window.location.href = '/register'

    });
}

