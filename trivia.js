/* Trivial utilities for Folksage */
class Trivia {
    static redirect(res, location) {
        res.writeHead(302, { 'Location' : location});
        res.end();
    }

    static try(success_message = '', failure_message = '') {
        return function (err) {
            if (err) console.log(failure_message + err);
            else if (success_message) console.log(success_message);
        };
    }
}

module.exports = Trivia;
