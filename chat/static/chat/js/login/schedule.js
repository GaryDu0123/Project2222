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
    return div;
}

async function createUserBox() {
    const navBar = document.querySelector(".navBar");
    const response = await getResponseData('/api/get_user_friend_box');
    if (response.data === undefined || response.data === null) {
        return;
    }
    for (let record in response.data) {
        navBar.appendChild(createBox('div', 'userBox', response.data[record]));
    }
}

// 需要测试data更改的问题
async function updateChatBox() {
    const navBar = document.querySelector(".chatBox");
    const response = await getResponseData('/api/get_message');

    if (response.data === undefined || response.data === null) {
        return;
    }
    for (let record in response.data) {
        if (response.data[record].content === undefined || response.data[record].from === undefined) {
            return;
        }
        console.log(response.data[record].content)
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

}

async function main() {
    await createUserBox();
    await updateChatBox();
}

main().then()