import {manager} from "./schedule.js";

const writeBox = document.querySelector(".sendWindow")

function sendCheck(writeBox) {
    return writeBox.innerText === "";
}


function rsaSign(plainText){
    let signText = new JSEncrypt();
    signText.setPrivateKey(manager.userPrivateKey);
    return signText.sign(plainText, CryptoJS.SHA256, "sha256");
}


// todo 验证数据
async function axiosRequest(text) {
    let param = new URLSearchParams()
    let receiver = manager.userBoxResponse[manager.currentSession].username;
    const encryptor_sender = new JSEncrypt();
    const encryptor_receiver = new JSEncrypt();
    let signedText = JSON.stringify([text, rsaSign(text)]);
    encryptor_sender.setPublicKey(manager.userPublicKey);// set A public key
    encryptor_receiver.setPublicKey(manager.userBoxResponse[manager.currentSession]['public_key']); // set B public key
    let convert = {
        'sender': encryptor_sender.encryptLong(signedText), // sender message encrypt with A's public key
        'receiver': encryptor_receiver.encryptLong(signedText) // sender message encrypt with B's public key
    }
    console.log(convert)
    param.append("content", JSON.stringify(convert)); // convert object to json string
    param.append('timestamp', new Date().getTime().toString()); // get current timestamp
    param.append('receiver', receiver);
    return await axios.post('/chat/messageReceive', param) // send the message to server
        .then(function (response) {
            // console.log(response);
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
        const navBar = document.querySelector(".chatBox");
        let innerDiv = document.createElement("div");
        innerDiv.className = "chatText";
        innerDiv.innerText = writeBox.innerText;
        let middleDiv = document.createElement("div");
        middleDiv.appendChild(innerDiv);
        middleDiv.className = "bubble-right"
        let outerDiv = document.createElement("div");
        outerDiv.appendChild(middleDiv);
        navBar.appendChild(outerDiv);
        writeBox.innerText = ""
        navBar.scrollTop = navBar.scrollHeight;
    } else {
        console.log("Send failed")
    }
}

const sendMessageButton = document.querySelector('#sendTextButton')
sendMessageButton.addEventListener('click', function () {
    seedMessage(writeBox).then()
}, false)