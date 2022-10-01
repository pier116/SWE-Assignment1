var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require('fs');

//global variable for tweet data
var tweetinfo = []
var tweetsearch = []

//load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err, data) {
  if (err) {
    req.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else {
    //store loaded data into a global variable for tweet data
    tweetinfo = JSON.parse(data);
  }
});

//Get functions
//Shows user info
app.get('/tweets', function (req, res) {
  //send all userIDs
  res.send({ tweetinfo: tweetinfo });
});

//Shows tweet info
app.get('/tweetinfo', function (req, res) {
  //send all tweet info  
  res.send({ tweetinfo: tweetinfo });
});

//Shows searched tweets
app.get('/searchinfo', function (req, res) {
  //send array of search tweets
  res.send({ tweetsearch: tweetsearch });
});

//Posts searched tweets
app.post('/searchinfo', function (req, res) {
  var tweetid = req.body.id;
  var found = false;
  var tweetfound;

  // Find tweet ID & add to 'tweetsearch' array
  tweetinfo.forEach(function (tweet, index) {
    if (!found && Number(tweet.id) === Number(tweetid)) {
      tweetsearch.push(tweet);
      tweetfound = tweet;
    }
  });
  res.send(tweetfound);
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function (req, res) {

  var tweet = req.body.text;
  var newID = req.body.id;
  var date = new Date().toString();

  // Push collected information into new tweet
  tweetinfo.push({
    id: newID,
    text: tweet,
    created_at: date
  });
});

//Update Screen Name
app.put('/tweets/:nm', function (req, res) {
  var nm = req.params.nm;
  var newName = req.body.newName;

  var flag = false;

  //Search for user name & flag if found
  tweetinfo.forEach(function (tweet, index) {
    if (!flag && String(tweet.user.name) === nm) {
      tweet.user.screen_name = newName;
      flag = true;
    }
  });
});

//Delete
app.delete('/tweetinfo/:tweetid', function (req, res) {
  //delete a tweet
  var tweetid = req.params.tweetid;
  var flag = false;

  //find matching tweetid and delete it
  tweetinfo.forEach(function (tweet, index) {
    if (!found && Number(tweet.id) === Number(tweetid)) {
      tweetinfo.splice(index, 1);
      flag = true;
    }
  });
});

app.listen(PORT, function () {
  console.log('Server listening on ' + PORT);
});