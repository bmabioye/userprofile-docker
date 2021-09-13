const express = require('express');
const path = require('path');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const dburl = 'mongodb://bma:iloveyou1@localhost:27017';
const PORT = 3000;

const client = new MongoClient(dburl);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


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
            response.send(newValues);
        });
    });

})
app.get('/profile-picture', (req, res) => {
    var img = fs.readFileSync('profile.jpg');
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