const express = require("express");
const mysql = require("mysql");
let config = require('./helpers/js/config');

const app = express();

app.use(express.static("helpers"));
app.use(express.json());

let pool = mysql.createPool(config)

function getShortUrl(longUrl) {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                console.log('Connection error', error);
                reject(error)
            } else {
                connection.query("SELECT * FROM opr_urls WHERE long_url = ? LIMIT 1;", [longUrl], function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    })
}

function getLongUrl(shortUrl) {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                console.log('Connection error', error);
                reject(error)
            } else {
                connection.query("SELECT * FROM opr_urls WHERE short_url = ? LIMIT 1;", [shortUrl], function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    })
}

function addNewUrl(longUrl) {
    return new Promise((resolve, reject) => {
        // generate shortUrl
        let shortUrl = Math.random().toString(36).toUpperCase().substr(2, 8)
        pool.getConnection((error, connection) => {
            if (error) {
                console.log('Connection error', error);
                reject(error)
            } else {
                connection.query("INSERT INTO opr_urls(url_id, long_url, short_url) VALUES(NULL, ?, ?);", [longUrl, shortUrl], function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(shortUrl);
                    }
                    connection.release();
                });
            }
        });
    })
}

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/helpers/index.html");
});

app.post("/api/create-short-url", function (request, response) {
    return getShortUrl(request.body.longUrl)
        .then(result => {
            if (result.length !== 0) {
                // get already generated shortUrl
                return response.status(200).json({
                    success: true,
                    shortUrl: result[0].short_url
                });
            } else {
                // first attempt for URL shortener
                addNewUrl(request.body.longUrl)
                    .then(_shortUrl => response.status(200).json({
                        success: true,
                        shortUrl: _shortUrl
                    }))
                    .catch(error => { throw error })
            }
        })
        .catch(err => response.status(500).json({
            success: false,
            message: err
        }))
});

app.get("/:shortUrl", function (request, response) {
    return getLongUrl(request.params.shortUrl)
        .then(result => response.redirect(result[0].long_url))
        .catch(error => response.status(500).json({
            success: false,
            message: error
        }))
});

app.listen(5000);