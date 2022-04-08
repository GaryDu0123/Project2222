export const manager = Object()
manager.currentSession = null;
manager.timestamp = null;
manager.userBoxResponse = null;


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
    // 改变当前的会话index
    manager.currentSession = nodes.indexOf(this)
    // 重新获取用户的信息
    initializeChatBox()
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
        navBar.appendChild(createBox('div', 'userBox', response.data[record]));
    }
}

// todo 需要测试data更改的问题
function initializeChatBox() {
    const navBar = document.querySelector(".chatBox");
    if (manager.userBoxResponse === null) {
        return
    }
    let param = new URLSearchParams()
    param.append("receiver", manager.userBoxResponse[manager.currentSession]);

    axios.post('/api/initChatData', param)
        .then(function (response) {
            if (response.data === undefined || response.data === null) {
                return;
            }
            for (let record in response.data) {
                if (response.data[record].content === undefined || response.data[record].from === undefined) {
                    return;
                }
                // console.log(response.data[record].content)
                let content = response.data[record].content;
                let from = response.data[record].from;
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
            }
            // 设置此次更新的时间戳, 供定时任务使用
            manager.timestamp = new Date().getTime().toString();
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function main() {
    await createUserBox();
}

main().then()