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
            return response['data']
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
    let request_data = await axiosRequest()
    if (request_data['status'] === "200") {
        console.log(request_data)
        let new_element = "<li><article>\n" +
            "                        <div class=\"title\">" +
                                        sendTitle.innerText +
            "                        </div>\n" +
            "                        <div class=\"name\">" +
                                        request_data['content'].user +
            "                        </div>" +
            "                        <div class=\"time\">" +
                        request_data['content'].time +
            "                        </div>" +
            "                        <div class=\"blogText\">" +
            writeBox.innerText +
            "                        </div>" +
            "                    </article> </li>"
        sendTitle.innerText = ""
        writeBox.innerText = ""
        let blog_item_box = document.querySelector('ul.blog-item-box')
        blog_item_box.innerHTML = new_element + blog_item_box.innerHTML

    } else {
        console.log("Send failed")
    }
}

const sendMessageButton = document.querySelector('#sendTextButton')
sendMessageButton.addEventListener('click', function () {
    seedMessage().then()
}, false)