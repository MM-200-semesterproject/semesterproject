const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'database-user',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

pool.query('SELECT *FROM users', (err, result) => {
    if (err) {
        return console.error('Error executing query', err.stack)
    }
    console.log(result.rows[0]) // brianc
})