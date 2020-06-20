const express = require('express', '4.17.1');

const parser = require('body-parser');
const app = express();
const port = 3000;

app.use(parser.urlencoded({ extended : true }));

app.listen(port, () => console.log(`Listening on port ${port}!`));

app.set('view engine', 'ejs');

const SongCtlr = require('./song-ctlr');
const songCtlr = new SongCtlr();


const db = require('./db');
db.initialize();

app.get('/', (req, res) => {
    res.render('song-index', { songs : db.songs() });
});

app.get('/songs/new', (req, res) => {
    songCtlr.newSongPage(req, res);
});

app.post('/songs/new', (req, res) => {
    console.log('creating song');
    songCtlr.createSong(req, res);
    res.redirect();
});
