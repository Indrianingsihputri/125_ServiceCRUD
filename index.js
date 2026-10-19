import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({ 
        extended: true 
    })
)

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '1234',
    port: 5432,
})

//GET ALL DATA
app.get('/', (req, res) => {
    console.log("TEST DATA :");

    pool.query('SELECT * FROM biodata ORDER BY id')
    .then((result) => {
        res.sednd(result.rows)
    })
    .catch((err) => {
        console.error(err)
        res.status(500).send('Internel Server Error')
    });
});