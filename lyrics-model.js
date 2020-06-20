const Db = require('./db');

class Version {

    constructor(desc) {
        this.lyrics = Version.parse_lyrics(desc.text);
        this.songId = desc.songId;
    }

    /* Splits a string into stanzas and lines by newlines */
    static parseLyrics(str) {
        let lyrics = [];
        let stanza_num = -1;

        /* Respectively, the index of the character currently being examined
           and the index of the first character after the previous newline. */
        let cursor, line_start;

        let advance_cursor = function () {
            cursor++;
            return cursor < str.length;
        };

        let is_newline = function () {
            /* Is the character at the cursor an EOL character? */
            return str[cursor] === '\n' || str[cursor] === '\r';
        };

        let flush_whitespace = function () {
            while (is_newline()) if (!advance_cursor()) return false;
            begin_line();
            return true;
        };

        let begin_line = () => line_start = cursor;

        /* Add a new stanza to the song */
        let begin_stanza = function () {
            lyrics.push([]);
            stanza_num++;
            console.log('new stanza'); // delet this
        };

        /* Add the line just read to the current stanza */
        let add_line = function () {
            lyrics[stanza_num].push(str.substring(line_start, cursor));
        };

        cursor = 0, line_start = 0;
        flush_whitespace();
        begin_stanza();
        while (advance_cursor()) {
            if (is_newline()) {
                add_line();
                if (!advance_cursor()) break;

                /* Multiple consecutive newlines means a new stanza: */
                if (is_newline()) {
                    if (flush_whitespace()) begin_stanza();
                    else break;
                }
                begin_line();
            }
        }

        /* Make sure the last line is added even if there is no trailing newline */
        if (str[cursor-1] != '\n') add_line();

        return lyrics;
    }
}
