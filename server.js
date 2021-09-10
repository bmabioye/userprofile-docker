const express = require('express');
const path = require('path');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const { response } = require('express');
const { assert } = require('console');
const app = express();
//const testurl = 'mongodb://localhost:27017'; // 'mongodb://bma:ilovemymum@localhost:27017'
const dburl = 'mongodb://bma:ilovemymum@localhost:27017';
const PORT = 3000;

const client = new MongoClient(dburl);
//const dclient = new MongoClient(testurl);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get('/get-profile', (req, res) => {

    var response = res;

    client.connect((err) => {
        if (err) throw err;
        const db = client.db('user-accounts');
        const query = { userid: 1 };
        var userdata = db.collection('users');
        userdata.findOne(query, (err, result) => {
            if (err) throw err;
            client.close();
            response.send(result);
        });
    });

});
app.post('/update-profile', (req, res) => {
    var userObj = req.body;
    var response = res;

    console.log('connecting to the db....');

    client.connect((err) => {
        if (err) throw err;
        var db = client.db('user-accounts');
        const query = { userid: 1 };
        const newValues = { $set: userObj };

        console.log('successfully connected to the user-account db');

        db.collection('users').updateOne(query, newValues, { upsert: true }, (err, res) => {
            if (err) throw err;
            console.log('successfully update or inserted');
            client.close();
            response.send(userObj);
        });
    });

})
app.get('/profile-picture', (req, res) => {
    var img = fs.readFileSync('profile-1.jpg');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.listen(PORT, () => {
    console.log(`UserProfile app listening at http://localhost:${PORT}!`)
});

client.connect((err) => {
    if (err) throw err;
    console.log(`MongoDB is connected successfully and Database`)
})