const mysql = require('mysql');
const client = mysql.createPool({
    connectionLimit: 10,
    port: "3306",
    host: "mysqldb",
    database: "movies-db",
    user: "root",
    password: "password",
})

// client.connect((err) => {
//    if (err) throw err;
//    console.log("connected")
//})
const errorHandler = (err) => {
   console.log(err)
}

const getAll = (request, response) => {
    client.query("SElECT * FROM Student", (err, rows) => {
	if (err) {
	   response.json({success: false, err});
	} else {
	   response.json({success: true, rows});
        }
    });
}

const getById = (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id);
    const sql_quere = "SELECT * FROM Student WHERE student_id = ?"
    client.query(sql_quere, [id], (err, rows) => {
        if (err) {
            response.json({success: false, err});
        } else {
            response.json({success: true, rows});
        }
    });
}

module.exports = {
    getAll,
    getById,
}
