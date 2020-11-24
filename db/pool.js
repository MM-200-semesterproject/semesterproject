const pg = require('pg');
const encrypt = require('./encryption.js');
const dbCredentials =
    process.env.DATABASE_URL || require('./localenv').credentials;

class StorageHandler {
    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false,
            },
        };
    }

    async newUser(body) {
        const client = new pg.Client(this.credentials);
        const input = encrypt.hashCode(body);
        let results = null;
        console.log(
            `hashed input inside newUser: username: ${input.username}, password: ${input.password}`
        );

        try {
            await client.connect();
            results = await client.query(
                'INSERT INTO users(Email, Password) VALUES($1, $2) RETURNING id', [input.username, input.password]
            );
            results = results.rows[0].id;
            console.log(`row inserted with id: ${results}`);
            client.end();
        } catch (err) {
            results = err;
            console.log(err);
            client.end();
        }

        return results;
    }

    async loadUser(body) {
        const client = new pg.Client(this.credentials);
        const input = encrypt.hashCode(body);
        let results = null;

        try {
            await client.connect();
            results = await client.query(
                'SELECT * FROM users WHERE email = $1 AND password = $2', [input.username, input.password]
            );
            results = results.rows[0].id;
            console.log(`Result loadUser id: ${results}`);
            client.end();
        } catch (err) {
            results = err;
            console.log(`Error on loadUser: ${err}`);
            client.end();
        }

        return results;
    }

    async deleteUser(body) {
        const client = new pg.Client(this.credentials);
        const userid = body.userid;
        let password = encrypt.singleHash(body.password);
        let results = null;

        try {
            //delete presentations
            await client.connect();
            results = await client.query(
                'DELETE FROM presentations WHERE userid = $1', [userid]
            );

            console.log(`Presentations deleted`);
            //delete userinfo

            results = await client.query(
                'DELETE FROM users WHERE id = $1 AND password = $2', [userid, password]
            );

            console.log(`user deleted`);

            client.end();
        } catch (err) {
            console.log(`Error on deleteUser: ${err}`);
            results = err;
            client.end();
        }
        return results;
    }

    async deletePres(inp) {
        const client = new pg.Client(this.credentials);
        const input = inp;
        let results = null;

        try {
            await client.connect();
            results = await client.query(
                'DELETE FROM presentations WHERE userid = $1 AND presentationid =$2', [input.userid, input.presentationid]
            );

            console.log(`presentation with id ${input.presentationid} deleted`);

            client.end();
        } catch (err) {
            console.log(`Error on deleteUser: ${err}`);
            client.end();
        }
    }

    async loadPres(body) {
        const client = new pg.Client(this.credentials);
        const input = body;

        let presentationArray = [];
        let results = null;

        try {
            await client.connect();
            let results = await client.query(
                'SELECT COUNT(userid) FROM presentations WHERE userid = $1', [input.userid]
            );

            let rowcount = results.rows[0].count;

            results = await client.query(
                'SELECT * FROM presentations WHERE userid = $1', [input.userid]
            );
            for (let i = 0; i < rowcount; i++) {
                let row = results.rows[i];
                presentationArray.push(row);
            }
            results = presentationArray;

            client.end();
        } catch (err) {
            console.log(`Error on loadPres: ${err}`);
            results = err;
            client.end();
        }
        return results;
    }

    async createPres(inp) {
        const client = new pg.Client(this.credentials);
        const input = inp;
        let results = null;

        try {
            await client.connect();
            results = await client.query(
                'INSERT INTO presentations(userid, title, data)VALUES($1,$2, $3) RETURNING presentationid', [input.userid, input.title, input.slides]
            );

            results = results.rows[0];
            console.log(`Row created with presentationID: ${results.presentationid}`);
            console.log('Client will end now!');
            client.end();
        } catch (err) {
            console.log(`Error on createPres: ${err}`);
            results = err;
            client.end();
        }
        return results;
    }

    async updatePres(inp) {
        const client = new pg.Client(this.credentials);
        let input = inp;
        let results = null;

        try {
            await client.connect();
            results = await client.query(
                'UPDATE presentations SET data = $1 , title = $2 WHERE presentationid = $3 AND userid = $4 RETURNING title, userid, presentationid, data ', [input.slides, input.title, input.presentationid, input.userid]
            );
            results = results.rows[0];
            console.log(
                `column updated with presentation: ${results.title} for presentation with id:${results.presentationid}`
            );
            client.end();
        } catch (err) {
            console.log(`Error in UpdatePres: ${err}`);
            results = err;
        }
        return results;
    }
}

module.exports = new StorageHandler(dbCredentials);