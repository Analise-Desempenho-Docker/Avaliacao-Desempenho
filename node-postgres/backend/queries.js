const Client = require("pg").Client;
const client = new Client({
    user: process.env.DB_USER,
    host: "postgres-db",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

client.connect().then(() => console.log("Connected"))

const getAll = async (request, response) => {
    const result = await client.query("SELECT * from Student ORDER BY id")
    
    response.json(result.rows)
}

const getById = async (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id)
    const result = await client.query("SELECT * from Student WHERE id = $1", [id]) 
    
    response.json(result.rows)
}

module.exports = {
    getAll,
    getById,
}
