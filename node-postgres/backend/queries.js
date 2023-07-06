const Client = require("pg").Client;
const client = new Client({
    user: "postgres",
    host: "postgres-db",
    database: "db",
    password: "postgres",
    port: "5432",
})

client.connect().then(() => console.log("Connected"))

const getAll = async (request, response) => {
    const result = await client.query("SELECT * from movies ORDER BY id")
    
    response.json(result.rows)
}

const getById = async (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id)
    const result = await client.query("SELECT * from movies WHERE id = $1", [id]) 
    
    response.json(result.rows)
}

module.exports = {
    getAll,
    getById,
}
