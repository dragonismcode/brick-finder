var pingsPerMilisecond = "1000";

const express = require("express");
const app = express();
const port = 3000;
var fetch = require("node-fetch");
const fs = require('fs')
const path = require('path');
var latestid = require('./resources/id.json');

function checkLatest() {
    fetch("https://api.brick-hill.com/v1/user/profile?id=" + latestid.id).then(
        (response) => {
            response.json().then((data) => {
                if (typeof data.id !== "undefined") {
                    console.log(
                        "✅ User found! The user is: " + data.username + " (" + data.id + ")"
                    );

                    let newInfo = {
                        username: data.username,
                        id: data.id,
                        created_at: data.created_at,
                        img: data.img,
                        description: data.description
                    };

                    let newID = {
                        id: data.id
                    }

                    fs.writeFileSync('resources/file.json', JSON.stringify(newInfo));
                    console.log("// Updated API")
                    fs.writeFileSync('resources/id.json', JSON.stringify(newID));
                    console.log("// Saved into id.json")

                    latestid.id = +latestid.id + 1;
                    console.log("🔍 Searching for user with the ID of: " + latestid.id);
                } else {}
            });
        }
    );
}

checkLatest();

setInterval(checkLatest, pingsPerMilisecond);

app.get('/api', (req, res) => {
    console.log("🔔 Someone just pinged the API!")
    res.sendFile(path.join(__dirname, 'resources/file.json'));
});

app.get("/", (req, res) => res.send("Wasabi made this API."));

app.listen(port, () => console.log(`App listening on port ${port}!`));