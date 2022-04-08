import {manager} from "./schedule.js";
const writeBox = document.querySelector(".sendWindow")

function sendCheck(writeBox) {
    return writeBox.innerText === "";
}

// todo 验证数据
async function axiosRequest(text) {
    let param = new URLSearchParams()
    param.append("content", text);
    param.append('timestamp', new Date().getTime().toString())
    param.append('receiver', manager.userBoxResponse[manager.currentSession])
    return await axios.post('/chat/debug/messageReceive', param)
        .then(function (response) {
            console.log(response);
            return true;
        })
        .catch(function (error) {
            console.log(error);
            return false;
        });
}

async function seedMessage(writeBox) {
    if (sendCheck(writeBox)) {
        return;
    }
    console.log(document.cookie)
    if (await axiosRequest(writeBox.innerText)) {
        writeBox.innerText = ""
    } else {
        console.log("Send failed")
    }
}

const sendMessageButton = document.querySelector('#sendTextButton')
sendMessageButton.addEventListener('click', function () {
    seedMessage(writeBox).then()
}, false)