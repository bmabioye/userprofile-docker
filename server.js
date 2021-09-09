const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', (req, res) => {
    var img = fs.readFileSync('profile-1.jpg');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.listen(port, () => {
    console.log(`UserProfile app listening at http://localhost:${port}!`)
});