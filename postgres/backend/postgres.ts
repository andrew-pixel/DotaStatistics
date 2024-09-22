import 	{Pool} from "pg";

const pool = new Pool({
	user: "postgres",
  host: "localhost",
  database: "dotaStat",
  password: "postgres",
  port: 5050
});
const customQuery() = async(query : string) : Promise<any[]> =>{
  try{
    return await new Promise(function (resolve, reject){
      pool.query(query, (error, results) => {
        if (error){
          reject(error);
        }
        if(results && results.rows){
          resolve(results.rows);
        }
        else{
          reject(new Error("No Results found"));
        }
      });
    });
  }
  catch (error_1){
    console.error(error_1);
    throw new Error("Internal Server error");
  }
}

const getProHero() = async() => {
	try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM proheros", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};
//create a new merchant record in the databsse
const createProHero = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "INSERT INTO merchants (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new merchant has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
//delete a merchant
const deleteProHero = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "DELETE FROM merchants WHERE id = $1",
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Merchant deleted with ID: ${id}`);
      }
    );
  });
};
//update a merchant record
const updateProHero = (id, body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "UPDATE merchants SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(`Merchant updated: ${JSON.stringify(results.rows[0])}`);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
const dataModel = {
  customQuery,
  getProHero,
  createProHero,
  deleteProHero,
  updateProhero
};
export default dataModel
