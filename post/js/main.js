const BASE_URL = 'http://127.0.0.1:8000';
// 쿠키에서 csrf토큰을 가져오는 함수
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
//  csrf토큰 저장
const csrftoken = get_cookie('csrftoken')

// 유저 프로필 카드를 그려줄 함수
function create_user_profile(user_data) {
    const profile_card = document.getElementById('profile_card');
    let user_card_html =
        `<div class="card-body" id="profile_card_body">
                <h5 class="card-title">${user_data['nickname']}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${user_data['userprofile']['address']}</h6>
                <div class="hobby_box">
                `
    Object.values(user_data['userprofile']['hobby']).forEach(hobby => {
        user_card_html += `<div class="hobby_tag">${hobby['hobby_name']}</div>`
    })
    user_card_html += `</div></div>`
    profile_card.innerHTML = user_card_html
}
// 서버에서 가져온 포스트들을 그려줄 함수
function create_posts(posts_data, user_data) {
    const cards_wrapper = document.getElementById('cards_wrapper')
    Object.values(posts_data).forEach(post => {
        let card_html = `
        <div class="card">
            <div class="card-header profile_card_header">
                <div>
                ${post['author']['nickname']}
                </div>`
        if (user_data.nickname === post.author.nickname) {
            card_html += `
                <div class="profile_control_btn_box">
                <div class="profile_control_btn" onclick="edit_ready(${post.id}, '${post.title}', '${post.content}')">수정</div>
                &nbsp&nbsp
                <div class="profile_control_btn" onclick="post_delete(${post.id})">삭제</div>
                </div>
            `
        }
        card_html += `</div>
        <div class="card-body" id="card_box_${post.id}">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.content}</p>
            </div>
        </div>`


        cards_wrapper.innerHTML += card_html
    })
}
// 페이지가 로딩 될 때 데이터를 불러오는 fetch get method
window.onload = async function on_load() {
    token = localStorage.getItem('access')
    const result = await fetch(BASE_URL + '/post/', {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    }).then(res => res.json())
        .then(data => {
            let user_data = data['user'];
            let posts_data = data['posts'];
            create_user_profile(user_data);
            create_posts(posts_data, user_data);
        })
}
// 포스트를 포스팅하는 함수
async function post_upload() {
    const title = document.getElementById('post_title').value;
    const content = document.getElementById('post_content').value;
    if (title && content) {
        const token = localStorage.getItem('access')
        const result = await fetch(BASE_URL + '/post/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                "title": title,
                "content": content
            })
        }).then(res => {
            if (res.ok) {
                location.reload()
            }
        }).catch(error => {
            alert(error)
        })
    } else {
        alert("제목과 내용은 필수값입니다.")
    }

}

// 포스트를 수정하는 함수
async function post_delete(post_id) {
    const token = localStorage.getItem('access');

    url = new URL(BASE_URL + '/post/' + post_id);
    const result = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
            'X-CSRFToken': csrftoken,
        },
    }).then(res => {
        if (res.ok) {
            location.reload()
        }
    }).catch(error => {
        alert(error)
    })
}
// 포스트 수정을 위한 값을 받기 위한 함수
function edit_ready(post_id, post_title, post_content) {
    const profile_control_btn_box = document.querySelector('.profile_control_btn_box');
    profile_control_btn_box.innerHTML = `
    <div class = "profile_control_btn" onclick="post_edit(${post_id})">확인</div>
    &nbsp&nbsp
    <div class = "profile_control_btn" onclick="edit_cancel()">취소</div>
    `
    const card_box = document.getElementById('card_box_' + post_id);
    card_box.innerHTML = `
    <div class="row profile_title_input_wrapper">
    <div class="input-group mb-3">
        <input type="text" class="form-control" id="new_post_title" placeholder="${post_title}"
            aria-describedby="button-addon2">
    </div>
    <div class="input-group-lg">
        <textarea class="form-control content_input" id="new_post_content" placeholder="${post_content}"></textarea>
    </div>
</div>`
}
function edit_cancel() {
    location.reload()
}
// 포스트를 수정하는 함수
async function post_edit(post_id) {
    var e = window.event;
    e.preventDefault();
    const token = localStorage.getItem('access');
    url = new URL(BASE_URL + '/post/' + post_id);
    const new_title = document.getElementById('new_post_title').value;
    const new_content = document.getElementById('new_post_content').value;
    const result = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            "title": new_title,
            "content": new_content
        })
    }).then(res => {
        if (res.ok) {
            location.reload()
        }
    }).catch(error => {
        alert(error)
    })

}