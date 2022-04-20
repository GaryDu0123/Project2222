export const manager = Object()
manager.currentSession = null;
manager.timestamp = null;
manager.userBoxResponse = null;
manager.currentTimerId = null;
manager.userPrivateKey = null;
manager.userPublicKey = null;

console.log(manager)

axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
})


// todo 点击用户的时候添加元素
function changeSessionListener() {
    const navBar = document.querySelector(".navBar");
    let nodes = [...navBar.childNodes]
    // 清除当前的盒子以供更新
    const chatBox = document.querySelector(".chatBox");
    chatBox.innerHTML = ""

    if (manager.currentSession !== null){
        nodes[manager.currentSession].classList.remove('useBoxOnSelect')
    }

    // change current session index
    manager.currentSession = nodes.indexOf(this)
    this.classList.add('useBoxOnSelect')

    // re-get user information
    initializeChatBox()
    clearInterval(manager.currentTimerId)
    manager.currentTimerId = setPolling()
}


async function getResponseData(url) {
    return await axios.get(url)
        .then((response) => {
            // console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(error);
            return {}
        });
}

function createBox(elementType, className, text) {
    let div = document.createElement(elementType);
    div.className = className;
    div.innerText = text;
    div.addEventListener("click", changeSessionListener, false)
    return div;
}

async function createUserBox() {
    const navBar = document.querySelector(".navBar");
    const response = await getResponseData('/api/get_user_friend_box');
    if (response.data === undefined || response.data === null) {
        return;
    }
    manager.userBoxResponse = response.data
    for (let record in response.data) {
        navBar.appendChild(createBox('div', 'userBox', response.data[record].username));
    }
}

function requestMessageDataAndUpdate(urls, param, isInit=false) {
    const navBar = document.querySelector(".chatBox");
    axios.post(urls, param)
        .then(function (response) {
            console.log(response)
            if (response.data === undefined || response.data === null) {
                return;
            }
            if (response.data.length !== 0){
                manager.timestamp = new Date().getTime().toString();
            }
            if (isInit){
                manager.userPublicKey = response.data.userPublicKey
            }
            // console.log(response.data)
            for (let record in response.data) {
                if (response.data[record].content === undefined || response.data[record].from === undefined) {
                    return;
                }
                const verify_self = new JSEncrypt();
                const verify_sender = new JSEncrypt();
                const encryptor_self = new JSEncrypt();
                // A's public key to verify the message which send by A
                verify_self.setPublicKey(manager.userPublicKey)
                // B's public key to verify the message which send by B
                verify_sender.setPublicKey(manager.userBoxResponse[manager.currentSession]['public_key'])
                // A's private key to decrypt the message which belongs A
                encryptor_self.setPrivateKey(manager.userPrivateKey)
                let message_box = JSON.parse(encryptor_self.decryptLong(response.data[record].content).toString())
                let from = response.data[record].from;

                if (from === "sender") {
                    // verify the sign is it send by A it self
                    if (!verify_self.verify(message_box[0], message_box[1], CryptoJS.SHA256)){
                        continue;
                    }
                } else if (from === "receiver") {
                    // verify the sign is it send by B
                    if (!verify_sender.verify(message_box[0], message_box[1], CryptoJS.SHA256)){
                        continue;
                    }
                }
                let content = message_box[0];
                let innerDiv = document.createElement("div");
                innerDiv.className = "chatText"
                innerDiv.innerText = content
                let middleDiv = document.createElement("div");
                middleDiv.appendChild(innerDiv);

                if (from === "sender") {
                    middleDiv.className = "bubble-right"
                } else if (from === "receiver") {
                    middleDiv.className = "bubble-left"
                }
                let outerDiv = document.createElement("div");
                outerDiv.appendChild(middleDiv);
                navBar.appendChild(outerDiv);
                navBar.scrollTop = navBar.scrollHeight;
            }
            // Set the timestamp of this update for use by scheduled tasks
        })
        .catch(function (error) {
            console.log(error);
        });
}

// todo 需要测试data更改的问题
function initializeChatBox() {
    if (manager.userBoxResponse === null) {
        return
    }
    let param = new URLSearchParams()
    param.append("receiver", manager.userBoxResponse[manager.currentSession].username);
    requestMessageDataAndUpdate('/api/initChatData', param, true);
}

async function main() {
    await createUserBox();
}

function updateMessageBox() {
    console.log({
        "receiver": manager.userBoxResponse[manager.currentSession].username,
        "timestamp": manager.timestamp
    })
    let param = new URLSearchParams()
    param.append("receiver", manager.userBoxResponse[manager.currentSession].username);
    param.append("timestamp", manager.timestamp);
    requestMessageDataAndUpdate('/api/polling_message', param)
}

function setPolling() {
    return setInterval(function () {
        setTimeout(updateMessageBox, 0)
    }, 3000);
}

window.onload = function (){
    const login_username = document.querySelector('#username').value;
    manager.userPrivateKey = JSON.parse(localStorage.getItem(login_username)).privateKey;
    main().then()
}
