require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    max: 20,
    idleTimeoutMillis: 8000,
    connectionTimeoutMillis: 2000,
});

async function query(text, params) {
    try {
        const res = await pool.query(text, params)
        return res
    } catch (error) {
        console.error('Error en query:', error.message)
        throw error
    }
}

module.exports = {
    query,
    pool
}