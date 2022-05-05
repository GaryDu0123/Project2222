const writeBox = document.querySelector(".sendWindow")
const sendTitle = document.querySelector(".sendTitle")

// editor
var E = window.wangEditor; // 全局变量
const { createEditor, createToolbar, i18nChangeLanguage } = window.wangEditor
const editorConfig = {}
editorConfig.placeholder = 'Please enter content'
i18nChangeLanguage('en')
const toolbarConfig= {
    excludeKeys: [
        "group-image"
    ]
}

editorConfig.onChange = (editor) => {
    // 当编辑器选区、内容变化时，即触发
    // console.log('content', editor.children)
    // console.log('html', editor.getHtml())
}

// 创建编辑器
const editor = createEditor({
  selector: '#editor-container',
  config: editorConfig,
  mode: 'simple' // 或 'simple' 参考下文
})
// 创建工具栏
const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'simple' // 或 'simple' 参考下文
})

const contentBox = document.querySelector('.contentBox')
let showHideButton = document.querySelector("#showHideButton")
showHideButton.onclick = function (){
    console.log(this.innerHTML)
    if (this.innerHTML === 'SHOW') {
        this.innerHTML = 'HIDE'
        contentBox.style.display = 'block'
    } else {
        this.innerHTML = 'SHOW'
        contentBox.style.display = 'none'
    }
}


// axios

axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
})

// send message

async function axiosRequest() {
    let param = new URLSearchParams()
    param.append("title", sendTitle.innerText);
    param.append("content", editor.getHtml()); // convert object to json string
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
    if (editor.getHtml() === '') {
        return;
    }
    let request_data = await axiosRequest()
    if (request_data['status'] === "200") {

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
            editor.getHtml() +
            "                        </div>" +
            "                    </article> </li>"
        sendTitle.innerText = ""
        // writeBox.innerText = ""
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

const blogText = document.querySelector('.blogText')

