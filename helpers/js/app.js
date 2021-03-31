const host = "http://localhost:5000/";

document.getElementById("create-short-url").addEventListener("click", function () {
    let longUrl = document.getElementById("long-url").value.trim();
    let fetchUrl = host + 'api/create-short-url';
    if (longUrl.length === 0) {
        // no URL passed
        alert("Please enter URL!");
        return;
    } else if (!(longUrl.startsWith("http://") || longUrl.startsWith("https://"))) {
        //inalid URL passed
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
                document.getElementById("short-url").innerText = host + data.shortUrl;
                document.getElementById("short-url").href = host + data.shortUrl;
            } else {
                throw data.message;
            }
        })
        .catch(err => {
            alert("Something went wrong");
        })
});