// db config
const mysql = require('mysql2');
const db_config = {}
db_config.host ='localhost';    
db_config.user ='root';
db_config.password= '123456789';
db_config.database= 'alro_land';


// create connection to db
const connection = mysql.createConnection({
    host: db_config.host,
    user: db_config.user,
    password: db_config.password,
    database: db_config.database
});

// connect to database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

// ส่งออกการเชื่อมต่อ
module.exports = connection;

