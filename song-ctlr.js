const Song = require('./song-model');
const Db = require('./db');
const Triv = require('./trivia');

class SongController {
    async createSong(req, res) {
        console.log('Creating Song:');
        console.log(req.body);
        let newSong = await Db.createSong(req.body.song);
    }

    newSongPage(req, res) {
        res.render('song-form', { song : new Song() });
    }

}

module.exports = SongController;
