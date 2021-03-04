const express = require("express");
const app = express();
const port = 3000;
var fetch = require("node-fetch");
var mongodb = require("mongodb");
var latestid = "539355"
const fs = require('fs')
const path = require('path');

function checkLatest() {
  fetch("https://api.brick-hill.com/v1/user/profile?id=" + latestid).then(
    (response) => {
      response.json().then((data) => {
        if (typeof data.username !== "undefined") {
          console.log(
            "User found! The user is: " + data.username + " (" + data.id + ")"
          );

          let newInfo = { 
              username: data.username,
              id: data.id, 
              created_at: data.created_at,
              img: data.img,
              description: data.description
          };

          fs.writeFileSync('file.json', JSON.stringify(newInfo));
          console.log("Written into file.json")

          latestid = +latestid + 1;
          console.log("Searching for user with the ID of: " + latestid);
        } else {
        }
      });
    }
  );
}

checkLatest();

setInterval(checkLatest, 1000);

app.get('/api', (req, res) => {
  console.log("Someone just used the API! No way Jose!")
  
  res.sendFile(path.join(__dirname, 'file.json'));
});

app.get("/", (req, res) => res.send("Wasabi made this API."));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

