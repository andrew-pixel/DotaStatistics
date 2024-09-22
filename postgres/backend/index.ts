//node index.ts
//http://localhost:3001
import express, {Request, Response} from "express";
import dataModel from "./postgres";

const app = express()
const port = 3001

const model = proHeroModel;
app.use(express.json())
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
	next();
});
	
app.get("/custom-query", async (req: Request, res: Response) =>{
	const sqlQuery = req.query.q as string;

	if(!sqlQuery){
		return res.status(400).send({message: "Sql Query is required"});
	}

	try{
		const results = await customQuery(sqlQuery);
		res.status(200).json(results);
	}
	catch(error){
		res.status(500).send({message: "Internal Server Error", error : error.message});
	}
});

app.get('/', (req, res) => {
  model.getProHero()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/prohero', (req, res) => {
  model.createProhero(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/prohero/:id', (req, res) => {
  model.deleteProHero(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.put("/prohero/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  model
    .updateProHero(id, body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

async function insertMatchesIntoDB(matches: any[]) {
  const client = await pool.connect();

  try {
    for (const match of matches) {
      const { match_id, avg_mmr, radiant_win } = match;

      await client.query(
        `INSERT INTO public_matches (match_id, avg_mmr, radiant_win)
        VALUES ($1, $2, $3)
        ON CONFLICT (match_id) DO NOTHING`,  // Avoid duplicate matches
        [match_id, avg_mmr, radiant_win]
      );
    }
    console.log("Matches inserted successfully");
  } catch (error) {
    console.error("Error inserting matches into database:", error);
  } finally {
    client.release();
  }
}
// Endpoint to receive matches from React and insert into database
app.post('/matches', async (req: Request, res: Response) => {
  const matches = req.body;  // Expect matches to be in req.body

  if (!Array.isArray(matches) || matches.length === 0) {
    return res.status(400).json({ message: "Invalid match data" });
  }

  try {
    await insertMatchesIntoDB(matches);
    res.status(200).json({ message: "Matches inserted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error inserting matches" });
  }
});
app.listen(port, ()=>{
	console.log(`port ${port}`)
})
