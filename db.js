const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'password',
    database:'estetica'
});

async function getUserById(id) {
    const [rows] = await connection.query('SELECT * FROM agenda WHERE id_agenda = ?', [id]);
    return rows[0]
}

module.exports = { getUserById, connection };