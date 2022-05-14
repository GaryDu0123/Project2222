const sendTitle = document.querySelector(".sendTitle")


// editor
var E = window.wangEditor; // 全局变量
const {createEditor, createToolbar, i18nChangeLanguage} = window.wangEditor
E.Boot.registerModule(window.WangEditorPluginUploadAttachment.default)
const editorConfig = {
    placeholder: 'Type here...',
    hoverbarKeys: {
        attachment: {
            menuKeys: ['downloadAttachment'],
        },
    },
    MENU_CONF: {
        uploadAttachment: {
            server: '/api/upload-file',
            fieldName: 'custom-fileName',
            meta: {
                'csrfmiddlewaretoken': getCSRF()
            },
            onInsertedAttachment(elem) {
                console.log('inserted attachment ---- ', elem)
            },
        }
    }
}
editorConfig.placeholder = 'Please enter content';
const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN';
i18nChangeLanguage(LANG);
const toolbarConfig = {
    excludeKeys: [
        "group-image"
    ],
    insertKeys: {
        index: 0,
        keys: ['uploadAttachment'],
    }
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

function getCSRF(){
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    return document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
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
    let category = document.querySelector('.selectBox').value
    param.append('category', category)
    param.append("title", sendTitle.innerText);
    param.append("content", editor.getHtml()); // convert object to json string
    param.append('timestamp', new Date().getTime().toString()); // get current timestamp

    return await axios.post('/forum/repository/post', param) // send the message to server
        .then(function (response) {
            return response['data']
        })
        .catch(function (error) {
            console.log(error);
            return false;
        });
}

async function seedMessage() {
    if (sendTitle.innerText === '') {
        swal({
            title: "Title cannot be empty!",
            text: "",
            icon: "info",
            button: "OK",
        });
        return;
    }
    let request_data = await axiosRequest()
    if (request_data['status'] === "200") {
        let new_element = "<li><article id='" + request_data['content'].id + "'>\n" +
            "                        <div class=\"title\">" +
            sendTitle.innerText +
            "                        </div>\n<hr>" +
            "                        <span class=\"name\">" +
            `<img src="${textToImage(request_data['content'].user)}" alt="${request_data['content'].user}" >`+
            `<span>${request_data['content'].user}</span>`+
            "<div class='forum-category'>"+ request_data['content'].category +"</div>" +
            "                        </span>" +
            "                        <div class=\"time\">" +
            request_data['content'].time +
            "                        </div><hr>" +
            "                        <div class=\"blogText\">" +
            editor.getHtml() +
            "                        </div>" +
            "                    </article> </li>"
        sendTitle.innerText = ""
        // writeBox.innerText = ""
        editor.clear()
        let blog_item_box = document.querySelector('ul.blog-item-box')
        blog_item_box.innerHTML = new_element + blog_item_box.innerHTML
        replace()
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


function textToImage(name) {
    //设置初始值,防止name为空时程序无法执行
    let nick = "Unknown";
    //判断name是否为空
    if (name) {
        nick = name.charAt(0);
    }
    const fontSize = 14;
    const fontWeight = 'normal';

    let canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.remove();
    } else {
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
    context.textBaseline = "middle";
    context.fillText(nick, fontSize, fontSize);
    return canvas.toDataURL("image/png");
}

const blog_item_box_img = document.querySelectorAll('ul.blog-item-box > li > article > div > img')
for (let i = 0; i < blog_item_box_img.length; i++) {
    blog_item_box_img[i].src = textToImage(blog_item_box_img[i].alt)
}

function replace(){
    let files = document.querySelectorAll('span[data-link]')
    for (let i = 0; i < files.length; i++) {
        files[i].innerHTML = `<span contenteditable="false" 
        style="display: inline-block; 
        margin-left: 3px; 
        margin-right: 3px; 
        border: 2px solid transparent; 
        border-radius: 3px; padding: 0px 3px; 
        background-color: rgb(241, 241, 241); cursor: inherit;">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAv5JREFUWEetl1nITVEUx3/fo5LkyRQeFA+SIS8eZHhQimRKMhMSoogyR5QxMs9DkplQEhFvxihCKUWkpCTP9P9a+1p3f2efe869367T3Xeftdf/v9e012mi9cZQYDzQBxgIfANeAO+BDSmYplbCX58HAnwFFgNXY7zWIHABmBQpfg10A9pH64OAZ36tUQLngClO4XVgC/DU1iYCF937N+aiylIjBM4A05xy+XljwqV/3bpkKjFRL4GTwMyU0gwSY4Abtn4NGBdk6iFwFJhbAjyI/gLaAR+BnvUSOATML2j22BCvgL7AbyPS/L6MBfYDC3NOrlS8BLzNcIGi/4mtPwSGlbXAHmBJDriCSgQU5UrJmIT8Ptb277OaUNgCu4BlBcCDSFWUGzFfCXV6WaEQge3A8hLgcSquBjbnBWxeDGwFVtXwuT9ZfHLtlY4wFB9xxUwGoViLfVGzxuCymqyXC57KAilb1wC44kVxUxM8i8Bs4HgJn8cnV6YoYwqBxwR6A/eBzrY7Vh5SLeUW1QjVisLgMQEFyQTbfQqY5ZTVAp8HHC4L7gnocrhiCj5ZpdKvxlJgd45b5gDHcsDzKmQlC3zUrwS2mcJ+wAPXWMRumQHIWimzh04pVSErBG4Do0zLaOCWzX2rpeZjqgPT/GwB8FTMNK+HQqSerZNJKgjVUGro9Go2NXwJnQycLwGebFYCgS9AF1PYEfhu8wXAQZurfh8AutcoMnGDGrvN8f5vAQVg6FJGAndNqq211SE1qzbb9evLaylw74I1wCbTvgLY4ZAGAzeBDhH6kYzmRARyfR6fILhAd7XubI0fQC/gpxNuY23YcOCDdbrP3fvSJw97/W14B5D5NR4DQ2K2if91g3sXaN4V+OxAlN+LgD8J4B7WbJTpjluoivuB6cBpJ6VquBd4BAST67tP1tHFIxKlfJ6KAb8+AriXcWqlarCUf60ashY4UdBlVWKpjkgRvzP6+MjSf9nA39UDHsdAlg7VhgFAf3sk89IefXq3+NotS+QfmNG0IS7jBhcAAAAASUVORK5CYII=" style="width: 1em; margin-right: 0.1em; min-width: 0px; min-height: 0px;">
        <a style="text-decoration: none; color: #222222" href="${files[i].attributes['data-link'].nodeValue}">${files[i].innerHTML}</a>
        </span>
        `;
    }

}
replace()


let category = document.querySelector('.category').childNodes
for (let i = 0; i < category.length; i++) {
    category[i].onclick = function(){
        location.href = '/forum/repository/search?category=' + category[i].innerText;
    }
}