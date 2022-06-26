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
    if (user_email && user_password) {
        fetch(BASE_URL + '/user/login', {
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
                "email": user_email,
                "password": user_password
            }),
        }).then(res => res.json())
            .then(data => {
                for (const key in data) {
                    localStorage.setItem(key, data[key])
                }
                location.replace('/post/main.html')
            })
            .catch(error => {
                alert(error)
            })
    } else {
        alert("아이디와 패스워드를 입력해주세요")
    }


}

