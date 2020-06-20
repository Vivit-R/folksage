const fs = require('fs');
const sqlite3 = require('sqlite3', '4.1.1').verbose();
const Triv = require('./trivia');
// const lyrics = require('./lyrics');

class Db {
    static initialize() {
        const db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Database opened');
        });
        this.db = db;
        let schema = fs.readFileSync('./schema.sql', 'utf-8', Triv.try());
        let cmds = schema.split(';');
        db.serialize(() => {
            for (let i = 0; i < cmds.length; i++) {
                let cmd = cmds[i];
                if (/\S/.test(cmd)) db.run(cmd, Triv.try());
            }
            console.log('finished loading schema');
            db.run('INSERT INTO song VALUES (0, "hello");', Triv.try('Insertion test passed'));
            db.each('SELECT (songID, song_name) FROM song;', (row, err) => {
                if (err) { console.err(err); return; }
                console.log('Selection test passed');
            });
        });
    }

    static createSong(desc) {
        let stmt = this.db.prepare('INSERT INTO song VALUES (?, ?)');
        console.log(`Inserting song "${desc.name}" into database`);
        stmt.run(this.countVersions(), desc.name);
    }

    static countVersions() {
        let num_versions = 0;
        this.db.all(`SELECT songID FROM song WHERE (songID = ${song_id})`,
                    (rows, err) => {
                        num_versions = rows.length;
                    });
    }

    static songs() {
        let songs;
        this.db.all('SELECT songID AS id, song_name AS name FROM song;', (rows, err) => {
            songs = rows.map((desc) => new Song(desc));
        });
        return songs;
    }

    static deleteSong(song_id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM song WHERE songID = ' + song_id);
        });
    }

    static findSong(song_id) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT songID AS id, song_name AS name FROM song' +
                        `WHERE songID = ${song_id}`,
                        (err, rows) => {
                            if (rows.length >= 1) {
                                resolve(new Song(rows));
                            } else {
                                reject(`No song with id ${song_id} found`);
                            }
                        });
        });
    }

/*
    static addVersion(desc) {
        let song_id = desc.id;
        let num_versions = this.countVersions(desc);
        db.run(`INSERT INTO versions VALUES (${num_versions},${desc.id}, ${JSON.stringify(lyrics.parse_lyrics(desc.text))})`);
    }
*/
}

module.exports = Db;
