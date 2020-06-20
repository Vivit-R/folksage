class Song {
    constructor(desc) {
        if (desc) {
            this.id = desc.id;
            this.name = desc.name;
        }
        this.errors = [];
    }


}

module.exports = Song;
