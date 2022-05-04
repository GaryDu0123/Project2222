const writeBox = document.querySelector(".sendWindow")
const sendTitle = document.querySelector(".sendTitle")

axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
})

function sendCheck(){
    return writeBox.innerText !== "" && sendTitle.innerText !== ""
}

async function axiosRequest() {
    let param = new URLSearchParams()
    param.append("title", sendTitle.innerText);
    param.append("content", writeBox.innerText); // convert object to json string
    param.append('timestamp', new Date().getTime().toString()); // get current timestamp

    return await axios.post('/forum/post', param) // send the message to server
        .then(function (response) {
            console.log(response)
            return response.data['status'] === '200';
        })
        .catch(function (error) {
            console.log(error);
            return false;
        });
}

async function seedMessage() {
    if (!sendCheck()) {
        return;
    }
    if (await axiosRequest()) {
        sendTitle.innerText = ""
        writeBox.innerText = ""
    } else {
        console.log("Send failed")
    }
}

const sendMessageButton = document.querySelector('#sendTextButton')
sendMessageButton.addEventListener('click', function () {
    seedMessage().then()
}, false)