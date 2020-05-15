const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log("Listening on port", 3000);
})