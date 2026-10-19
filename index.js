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

// POST (Tambah data)
app.post('/biodata', (req, res) => {
    const { id, nama, nim, jurusan } = req.body

    pool.query(
        'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4)', 
        [id, nama, nim, kelas]
    )
    .then(result => (result.rows[0]))
    .catch(err => console.error(err));
});

// PUT (Update data)
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, id]
    )
    .then(result => {
        if (result.rows.length === 0) {
            res.status(404).json({ 
                message: 'Data tidak ditemukan' 
            });
        }

        res.json({
            message: 'Data berhasil diupdate',
            data: result.rows[0]
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
})