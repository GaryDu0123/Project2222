const writeBox = document.querySelector(".sendWindow")
const sendTitle = document.querySelector(".sendTitle")

// editor
var E = window.wangEditor; // 全局变量
const {createEditor, createToolbar, i18nChangeLanguage} = window.wangEditor
const editorConfig = {}
editorConfig.placeholder = 'Please enter content';
const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN';
i18nChangeLanguage(LANG);
const toolbarConfig = {
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
showHideButton.onclick = function () {
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
    if (editor.getText() === '') {
        return;
    }
    let request_data = await axiosRequest()
    if (request_data['status'] === "200") {

        let new_element = "<li><article id='" + request_data['content'].id + "'>\n" +
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
        editor.clear()
        let blog_item_box = document.querySelector('ul.blog-item-box')
        blog_item_box.innerHTML = new_element + blog_item_box.innerHTML

    } else if (request_data['status'] === "muted") {
        swal({
            title: "Waring",
            text: "You have been banned from posting!",
            icon: "warning",
            button: "OK",
        });
    } else {
        swal("Send failed", '', "error")
    }
}

const sendMessageButton = document.querySelector('#sendTextButton')
sendMessageButton.addEventListener('click', function () {
    seedMessage().then()
}, false)


function textToImage(name){
    //设置初始值,防止name为空时程序无法执行
    let nick = "未知";
    //判断name是否为空
    	if(name){
    		nick = name.charAt(0);
    	}
    const fontSize = 14;
    const fontWeight = 'normal';

    let canvas = document.getElementById('canvas');
    if(canvas){
        canvas.remove();
    }else{
        const html = "<canvas id='canvas' style='display:none'></canvas>";
        $("body").append(html);
        canvas = document.getElementById('canvas');
    }
    canvas.width = 28;
    canvas.height = 28;
    const context = canvas.getContext('2d');
    //头像背景颜色设置
    context.fillStyle = 'rgba(145,234,243,0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //头像字体颜色设置
    context.fillStyle = '#FFFFFF';
    context.font = fontWeight + ' ' + fontSize + 'px cursive';
    context.textAlign = 'center';
    context.textBaseline="middle";
    context.fillText(nick, fontSize, fontSize);
    return canvas.toDataURL("image/png");
}
const blog_item_box_img = document.querySelectorAll('ul.blog-item-box > li > article > div > img')
for (let i = 0; i < blog_item_box_img.length; i++) {
    blog_item_box_img[i].src = textToImage(blog_item_box_img[i].alt)
}
