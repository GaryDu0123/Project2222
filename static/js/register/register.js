window.onload = function(){
    console.log("test start");
    initSubmitButton();
}

// 判断输入值和二次输入值是否相同
function inputBoxCheck(){
    const passwordCheckBox = document.querySelector("#passwordCheckBox");
    const password = document.querySelector("#password");
    return passwordCheckBox.value === password.value;
}

// 判断用户名是否不为空
function usernameCheck(){
    const username = document.querySelector("#username");
    const usernameValue = username.value;
    return usernameValue.length >= 1;

}

function checkAll(){
    return inputBoxCheck() && usernameCheck()
}

function initSubmitButton(){
    const form = document.querySelector("#postForm");
    form.method = "post";
    const submitButton = document.querySelector("#submitButton");

    submitButton.onclick = function(){
        if (!checkAll()){
            console.log("failed")
            return false;
        }
        form.submit();
    }
}

