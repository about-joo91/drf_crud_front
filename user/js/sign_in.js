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
async function login() {
    const user_email = document.getElementById('email').value;
    const user_password = document.getElementById('password').value;
    const result = await fetch(BASE_URL + '/user/control', {
        method: "POST",
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            "username": user_email,
            "password": user_password
        }),
    })
    if (result.ok) {
        location.replace('/post/main.html')
    }
    else {
        alert(result.body)
    }
}
