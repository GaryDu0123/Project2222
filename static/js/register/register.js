axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
})

window.onload = function () {
    const submitButton = document.querySelector('#submitButton')
    submitButton.onclick = function () {
        initSubmitButton().then()
    };
}

async function createRSAKey() {
    // reference: https://www.h5w3.com/141188.html
    let keys = {};
    await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 1024, // can be 1024, 2048 or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"} // or SHA-512
        },
        true,
        ["encrypt", "decrypt"]
    ).then(async function (keyPair) {
        await window.crypto.subtle.exportKey(
            "pkcs8",
            keyPair.privateKey
        ).then(function (exportedPrivateKey) {
            // converting exported private key to PEM format
            keys['privateKey'] = toPemPrivate(exportedPrivateKey);
        }).catch(function (err) {
            console.log(err);
        });
        await window.crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        ).then(function (keyData) {
            keys['publicKey'] = toPemPublic(keyData);
        }).catch(function (err) {
            console.error(err);
        });
    });

    return keys;
}


// 判断输入值和二次输入值是否相同
function inputBoxCheck() {
    const passwordCheckBox = document.querySelector("#passwordCheckBox");
    const password = document.querySelector("#password");
    return passwordCheckBox.value === password.value;
}

// 判断用户名是否不为空
function usernameCheck() {
    const username = document.querySelector("#username");
    const usernameValue = username.value;
    return usernameValue.length >= 1;

}

function checkAll() {
    return inputBoxCheck() && usernameCheck()
}


async function initSubmitButton() {
    const username = document.querySelector('#username')
    const password = document.querySelector("#password")
    const passwordCheckBox = document.querySelector('#passwordCheckBox')
    const publicKey = document.querySelector('#public_key')
    if (!checkAll()) {
        return
    }
    if (publicKey === null) {
        console.error("Public Key Not Found")
        return;
    }
    let keys;
    try {
        keys = await createRSAKey();
    } catch (err) {
        console.log(err)
        return;
    }
    let userPublicKey = keys.publicKey;
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey.value); // 设置公钥
    let param = new URLSearchParams()
    let profile_info = {
        'username': username.value,
        'password': password.value,
        'passwordCheckBox': passwordCheckBox.value,
    }
    console.log(profile_info)
    param.append("key", encryptor.encrypt(JSON.stringify(profile_info)));
    param.append('timestamp', new Date().getTime().toString());
    param.append('publicKey', userPublicKey)
    axios.post('/register', param)
        .then(function (response) {
            console.log(response);
            if (response.status === 200) {
                localStorage.setItem(username.value, JSON.stringify({
                    'publicKey': keys.publicKey,
                    'privateKey': keys.privateKey,
                }))
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


function arrayBufferToBase64(arrayBuffer) {
    let byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(byteString);
}


function addNewLines(str) {
    let finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

function toPemPrivate(privateKey) {
    let b64 = addNewLines(arrayBufferToBase64(privateKey));
    return "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";
}

function toPemPublic(publicKey) {
    let b64 = addNewLines(arrayBufferToBase64(publicKey));
    return "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
}
