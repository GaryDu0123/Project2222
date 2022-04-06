


async function getUserFriendBox() {
    return await axios.get('/api/get_user_friend_box')
        .then((response) => {
            // console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(error);
            return {}
        });
}

function createBox(text){
    let div = document.createElement('div');
    div.className = 'userBox';
    div.innerText = text;
    return div;
}

async function createUserBox(){
    const navBar = document.querySelector(".navBar");
    const response = await getUserFriendBox();
    console.log(response)
    if (response.data === undefined || response.data === null){
        return;
    }
    for (let record in response.data){
        navBar.appendChild(createBox(response.data[record]))
    }
}

async function main(){
    await createUserBox()
}

main().then()