// db config
const mariadb = require("mariadb");

const db_config = {};
db_config.host = "localhost";
db_config.user = "root";
db_config.password = "123456789";
db_config.database = "alro_land";

// create connection to db
const connection = mariadb.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

// Create the connection pool
const pool = mariadb.createPool(db_config);

// Get all
async function getDataAllFromDB(query) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา
    const results = await conn.query(query);
    return results;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.end(); // ปิดการเชื่อมต่อ (แต่ยังคงมี pool เปิดอยู่)
      console.log("Connection closed");
      console.log("-------------------------------");
      //   setTimeout(()=>{
      //     pool.end(); // ปิด pool หลังใช้งานเสร็จ
      //     console.log('Connection pool closed.');
      //   }, 3000)
    }
  }
}

// Get all
async function getDataAllWithOneFromDB(query, param) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา
    const results = await conn.query(query, param);
    return results;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.end(); // ปิดการเชื่อมต่อ (แต่ยังคงมี pool เปิดอยู่)
      console.log("Connection closed");
      console.log("-------------------------------");
      //   setTimeout(()=>{
      //     pool.end(); // ปิด pool หลังใช้งานเสร็จ
      //     console.log('Connection pool closed.');
      //   }, 3000)
    }
  }
}

// get page and limit
async function getDataFromDB(query, [limit, offset]) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา
    const results = await conn.query(query);
    return results;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.end(); // ปิดการเชื่อมต่อ (แต่ยังคงมี pool เปิดอยู่)
      console.log("Connection closed");
      console.log("-------------------------------");
      //   setTimeout(()=>{
      //     pool.end(); // ปิด pool หลังใช้งานเสร็จ
      //     console.log('Connection pool closed.');
      //   }, 3000)
    }
  }
}

// Get search one param
async function getSearchDataFromDB(query, param) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา
    const results = await conn.query(query, param);
    return results;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.end(); // ปิดการเชื่อมต่อ (แต่ยังคงมี pool เปิดอยู่)
      console.log("Connection closed");
      console.log("-------------------------------");
    }
  }
}

// Get search one
async function getSearchOneDataFromDB(query, param) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา
    const results = await conn.query(query, param);
    return results;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.end(); // ปิดการเชื่อมต่อ (แต่ยังคงมี pool เปิดอยู่)
      console.log("Connection closed");
      console.log("-------------------------------");
      //   setTimeout(()=>{
      //     pool.end(); // ปิด pool หลังใช้งานเสร็จ
      //     console.log('Connection pool closed.');
      //   }, 3000)
    }
  }
}

// Insert a new data
async function insertDataToDB(query, body) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา พร้อมค่าพารามิเตอร์
    const result = await conn.query(query, body);

    // ตรวจสอบจำนวนแถวที่ได้รับผลกระทบ
    console.log(`Rows affected: ${result.affectedRows}`);

    // ถ้าการ Insert สำเร็จ, result จะมีจำนวนแถวที่ถูกเปลี่ยนแปลง
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.release(); // คืน connection กลับสู่ pool
      console.log("Connection released");
      console.log("-------------------------------");
    }
  }
}

// remove one with id
async function removeDataToDB(query, body) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา พร้อมค่าพารามิเตอร์
    const result = await conn.query(query, body);

    // ตรวจสอบจำนวนแถวที่ได้รับผลกระทบ
    console.log(`Rows affected: ${result.affectedRows}`);

    // ถ้าการ Insert สำเร็จ, result จะมีจำนวนแถวที่ถูกเปลี่ยนแปลง
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.release(); // คืน connection กลับสู่ pool
      console.log("Connection released");
      console.log("-------------------------------");
    }
  }
}

async function updateOneDataToDB(query, body) {
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมา พร้อมค่าพารามิเตอร์
    const result = await conn.query(query, body);

    // ตรวจสอบจำนวนแถวที่ได้รับผลกระทบ
    console.log(`Rows affected: ${result.affectedRows}`);

    // ถ้าการ Insert สำเร็จ, result จะมีจำนวนแถวที่ถูกเปลี่ยนแปลง
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.release(); // คืน connection กลับสู่ pool
      console.log("Connection released");
      console.log("-------------------------------");
    }
  }
}

// search like
async function getLikeSearchFromDB(query, body) {
  // console.log('param:',body[0])
  let conn;
  try {
    // ขอ connection จาก pool
    console.log("Attempting to connect to database...");
    conn = await pool.getConnection();
    console.log("Connected successfully!");

    // ใช้ query ที่ได้รับมาและพารามิเตอร์
    const results = await conn.query(query);
    console.log("ผลลัพธ์:", results);
    return results;
  } catch (err) {
    throw new Error("Error executing query: " + err.stack);
  } finally {
    if (conn) {
      conn.end(); // ปิดการเชื่อมต่อ (แต่ยังคงมี pool เปิดอยู่)
      console.log("Connection closed");
      console.log("-------------------------------");
    }
  }
}

// Export pool
module.exports = {
  getDataAllFromDB,
  getDataFromDB,
  insertDataToDB,
  getLikeSearchFromDB,
  pool,
  getSearchDataFromDB,
  getSearchOneDataFromDB,
  removeDataToDB,
  updateOneDataToDB,
  getDataAllWithOneFromDB
};
