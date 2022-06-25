const BASE_URL = 'http://127.0.0.1:8000';
function get_cookie(name) {
    let cookie_value = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookie_value = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookie_value;
}
const csrftoken = get_cookie('csrftoken')
async function sign_up() {
    const userEmail = document.getElementById('inputemail').value;
    const userPassword = document.getElementById('inputPassword').value;
    const userNickname = document.getElementById('inputNickname').value;
    const userFullname = document.getElementById('inputFullname').value;
    const userAddress = document.getElementById('inputAddress').value;
    const multiple_input = document.getElementById('multiple_input');
    var selected = Array.from(multiple_input.options).filter(function (option) {
        return option.selected;
    }).map(function (option) {
        return option.value;
    })
    try {
        const result = await fetch(BASE_URL + '/user/create', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                "email": userEmail,
                "password": userPassword,
                "nickname": userNickname,
                "fullname": userFullname,
                "userprofile": {
                    "address": userAddress,
                    "get_hobbies": selected
                }

            })
        })
        if (result.ok) {
            location.replace('/user/sign_in/')
        }
    }
    catch (err) {
        console.log(err)
    }
}
