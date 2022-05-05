axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
})

window.onload = function(){
    const submitButton = document.querySelector('#submitButton')
    const username = document.querySelector('#username');
    const password = document.querySelector("#password");
    username.onclick = function(){
        clearErrorTag()
    }
    password.onclick = function(){
        clearErrorTag()
    }
    submitButton.onclick = function(){
        initSubmitButton()
    };
}

function clearErrorTag(){
    let errorTag = document.querySelector('#loginError')
    if (errorTag !== null){
        errorTag.remove()
    }
}

function usernameCheck(){
    const username = document.querySelector("#username");
    const usernameValue = username.value;
    return usernameValue.length >= 1;

}

function userPasswordCheck(){
    const password = document.querySelector("#password");
    return password.value.length >= 1;
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

function showLoginErrorReason(errorText){
    clearErrorTag()
    const textBox = document.querySelector('#textBox');
    const postForm = document.querySelector('#postForm');
    let error_node = document.createElement('div')
    error_node.id = 'loginError'
    error_node.innerText = errorText
    postForm.insertBefore(error_node, textBox)

}

function clearPasswordInput(){
    const password = document.querySelector("#password");
    password.value = '';
}

function initSubmitButton(){
    const username = document.querySelector('#username');
    const password = document.querySelector("#password");
    const publicKey = document.querySelector('#public_key');
    if (!(usernameCheck() && userPasswordCheck())){
        showLoginErrorReason('Error: Username or password should not be empty.');
        return;
    }
    if (publicKey === null){
        console.error("Public Key Not Found");
        showLoginErrorReason('Error: Public Key Not Found.');
        return;
    }
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey.value); // set public key

    let param = new URLSearchParams();
    let profile_info = {
        'username': username.value,
        'password': password.value,
    }

    param.append("key", encryptor.encrypt(JSON.stringify(profile_info))); // encrypt the message
    param.append('timestamp', new Date().getTime().toString());
    axios.post('/login', param)
        .then(function (response) {
            if (response.status === 200){
                let nextHref = getNext();
                if (getNext() !== null) {
                    window.location.href = nextHref;
                } else {
                    window.location.href = '/main';
                }
            } else {
                showLoginErrorReason('Error: Incorrect username or password.');
                clearPasswordInput();
            }

        })
        .catch(function (error) {
            console.log(error);
            showLoginErrorReason('Error: Incorrect username or password.')
            clearPasswordInput();
    });
}

