const blog_item_box = document.querySelector('.blog-item-box')
function removeArticle(element){
    blog_item_box.removeChild(element)
}


const muteUserButton = document.querySelectorAll('.mute-user')
for (let i = 0; i < muteUserButton.length; i++) {
    muteUserButton[i].onclick = function () {
        swal({
            title: "Are you sure?",
            text: "User will be muted until you unlock",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                let message_id = muteUserButton[i].parentNode.getAttribute("id")
                let param = new URLSearchParams()
                param.append("id", message_id);
                axios.post('/forum/repository/muteuser', param).then(function (response) {
                    if (response.data && response.data.status && response.data.status === 'successful') {
                        swal("Successful", {
                            icon: "success",
                        });
                    } else {
                        swal("Fail due to unknown error", '', "error");
                    }

                }).catch(function (error) {
                        swal("Fail due to unknown error", '', "error");
                    }
                );
            }
        });
        let message_id = muteUserButton[i].parentNode.getAttribute("id")
    }
}

const deleteBlogButton = document.querySelectorAll('.delete-blog')
for (let i = 0; i < deleteBlogButton.length; i++) {
    deleteBlogButton[i].onclick = function () {
        swal({
            title: "Are you sure?",
            text: "This blog will be delete",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                let message_id = muteUserButton[i].parentNode.getAttribute("id")
                let param = new URLSearchParams()
                param.append("id", message_id);
                axios.post('/forum/repository/deleteblog', param).then(function (response) {
                    if (response.data && response.data.status && response.data.status === 'successful') {
                        swal("Successful", {
                            icon: "success",
                        });
                        removeArticle(muteUserButton[i].parentNode.parentNode.parentNode)
                    } else {
                        swal("Fail due to unknown error", '', "error");
                    }

                }).catch(function (error) {
                        swal("Fail due to unknown error", '', "error");
                    }
                );
            }
        });

    }
}
swal({
    icon: "warning",
    title: "Attention",
    text: "You are in admin mode",
    dangerMode: true
});