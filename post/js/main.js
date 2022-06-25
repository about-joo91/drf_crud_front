const BASE_URL = 'http://127.0.0.1:8000';
window.onload = on_load
async function on_load() {
    const result = await fetch(BASE_URL + '/user/control', {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    })
    if (result.ok) {
        console.log(result.body)
    }
}