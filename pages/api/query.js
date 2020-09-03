import mysql from "nodejs-mysql"

const db = mysql.getInstance({
    host: 'localhost',
    user: 'root',
    password: process.env.PASS,
    database: process.env.SQL_DB
});

export default async (req, res) => {
    let rows = await db.exec(`SELECT * FROM cards WHERE cards.text LIKE '%${req.body.query}%'`)
    res.send(rows)
}