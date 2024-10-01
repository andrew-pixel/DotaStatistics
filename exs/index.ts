const express = require("express");
const app = express();
const cors = require("cors")
const pool = require("./database")

app.use(cors());
app.use(express.json());

//Routes

//create
app.post("/heroes", async(req,res) => {
    try {
        const { heroid } = req.body;
        const newHero = await pool.query("INSERT into heroes (heroid) VALUES($1) RETURNING *", 
        [heroid]
        ); 

        res.json(newHero.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})
//get all
app.get("/heroes", async(req,res) => {
    try {
        const allHeroes = await pool.query("SELECT * from heroes");
        res.json(allHeroes.rows)
    } catch (error) {
        console.error(error.message);
    }
})

//get a 
app.get("/heroes:id", async(req,res) => {
    try {
        const {id} = req.params;
        const allHeroes = await pool.query("SELECT * FROM heroes WHERE id = $1", [id]);

        res.json(allHeroes.rows[0])
    } catch (error) {
        console.error(error.message);
    }
})
//update
app.put("/heroes:id", async(req,res) => {
    try {
        const {id} = req.params;
        const {winrate} = req.body;

        const allHeroes = await pool.query("UPDATE heroes SET winrate = $1 WHERE heroid = $2" , [winrate, id]);
        res.json("Hero updated");
    } catch (error) {
        console.error(error.message);
    }
})
//delete
app.delete("/heroes:id", async(req,res) => {
    try {
        const {id} = req.params;
        const {winrate} = req.body;

        const allHeroes = await pool.query("DELETE FROM heroes WHERE heroid = $1" , [id]);
        res.json(allHeroes.rows)
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(5000, () => {
    console.log("server started")
});