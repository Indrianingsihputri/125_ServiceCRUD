
import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;
const { Pool } = pg;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi ke database PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '1234',
    port: 5432,
});

// GET - Menampilkan semua data
app.get('/', (req, res) => {
    console.log('TEST DATA:');

    pool.query('SELECT * FROM biodata ORDER BY id')
        .then((result) => {
            res.status(200).json(result.rows);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

// POST - Menambahkan data
app.post('/biodata', (req, res) => {
    const { id, nama, nim, kelas } = req.body;

    pool.query(
        `INSERT INTO biodata (id, nama, nim, kelas)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [id, nama, nim, kelas]
    )
        .then((result) => {
            res.status(201).json({
                message: 'Data berhasil ditambahkan',
                data: result.rows[0]
            });
        })
        .catch((err) => {
            console.error(err);

            if (err.code === '23505') {
                return res.status(409).json({
                    message: 'ID sudah digunakan'
                });
            }

            res.status(500).send('Internal Server Error');
        });
});

// PUT - Mengubah data berdasarkan ID
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    pool.query(
        `UPDATE biodata
         SET nama = $1, nim = $2, kelas = $3
         WHERE id = $4
         RETURNING *`,
        [nama, nim, kelas, id]
    )
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'Data tidak ditemukan'
                });
            }

            res.json({
                message: 'Data berhasil diupdate',
                data: result.rows[0]
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

// DELETE - Menghapus data berdasarkan ID
app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;

    pool.query(
        'DELETE FROM biodata WHERE id = $1 RETURNING *',
        [id]
    )
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'Data tidak ditemukan'
                });
            }

            res.json({
                message: 'Data berhasil dihapus',
                data: result.rows[0]
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
