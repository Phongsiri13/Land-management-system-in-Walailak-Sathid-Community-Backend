// routes/authRouter.js
const express = require("express");
const mysql = require('mysql2');
const connection = require('../config/config_db')
const router = express.Router();

router.get("/",(req, res) => {
    res.send('People page')
});

router.get("/prefix",(req, res) => {
    connection.query('SELECT * FROM prefix', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return res.status(500).send('Database query error');
        }
        res.json(results);
    });
});

router.get("/:id_card",(req, res) => {
    const idCard = req.params.id_card
    connection.query(`SELECT first_name, last_name, prefix_name
FROM people p
JOIN prefix pf ON p.prefix_id = pf.prefix_id
WHERE p.ID_CARD = ?;
`, [idCard], (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            return res.status(500).send('Database query error');
        }

        if (results.length > 0) {
            // ส่งข้อมูลที่พบกลับไป
            res.json(results[0]);
        } else {
            // ถ้าไม่พบข้อมูล
            res.status(404).send('No data found for the given ID card');
        }
    });
});

module.exports = router;
