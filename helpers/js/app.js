const host = "http://localhost:5000/";

document.getElementById("create-short-url").addEventListener("click", function () {
    let longUrl = document.getElementById("long-url").value.trim();
    let fetchUrl = host + 'api/create-short-url';
    if (!(/^(http:\/{2}|https:\/{2})(\d|\w)+\S*\.\S+$/.test(longUrl))) {
        // no URL passed
        alert("Please enter valid URL!");
        return;
    }
    // make POST request
    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            longUrl: longUrl
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("short-url").innerText = data.shortUrl;
                document.getElementById("short-url").href = data.shortUrl;
            } else {
                throw data.message;
            }
        })
        .catch(err => {
            alert("Something went wrong");
        })
});