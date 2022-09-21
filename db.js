const sqlite3 = require("sqlite3").verbose();

const dbFile = "db.sqlite";

let db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connexion à la base sqlite3");
    const sql = `CREATE TABLE articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title text, 
        abstract text, 
        contents text, 
        author text,
        creationDate text,
        dateOfLastUpdate text
    )`;
    db.run(sql, (err) => {
      if (err) {
        console.log("Table déjà créée");
      }
    });
  }
});
module.exports = db;
