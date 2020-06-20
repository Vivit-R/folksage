/*
  Entity-relationship diagram:

  +===========+                          +=============+
  | song      |                          | version     |
  +===========+                          +=============+
  | songID*   |||----------------------o<| versionID*  |
  | song_name |                          +-------------+
  +-----------+                              -
         -                                   -
         -                                   |
         |                                   |
         |                                   |
         o                                   o
         ^                                   ^
   +============+                      +================+
   | annotation |                      | annotates_text |
   +============+                      +================+
   | note_num*  |||------------------|<| start          |
   | text       |                      | end            |
   +------------+                      +----------------+
*/

PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS song (
  songID INTEGER PRIMARY KEY,
  song_name TEXT
);

CREATE TABLE IF NOT EXISTS version (
  versionID INTEGER,
  songID INTEGER,
  lyrics TEXT, -- The lyrics in JSON format
  PRIMARY KEY (versionID, songID),
  FOREIGN KEY (songID) REFERENCES song(songID)
  ON DELETE CASCADE
);

--- Annotations
CREATE TABLE IF NOT EXISTS annotation (
  note_num INTEGER,
  songID INTEGER,
  words TEXT,
  PRIMARY KEY (note_num, songID),
  FOREIGN KEY (songID) REFERENCES song(songID)
  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS annotates_text (
  note_num INTEGER,
  versionID INTEGER,
  songID INTEGER,
  start_index INTEGER,
  end_index INTEGER,
  PRIMARY KEY (note_num, songID, versionID),
  FOREIGN KEY (note_num, songID)
  REFERENCES annotation(note_num, songID)
  ON DELETE CASCADE,
  FOREIGN KEY (versionID)
  REFERENCES version(versionID)
  ON DELETE CASCADE
);
