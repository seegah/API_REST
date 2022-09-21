const express = require("express");
const app = express();

app.use(express.json());

const db = require("./db.js");

app.get("/", (req, res) => {
  res.json({ message: "L'API marche" });
});

//obtenir tous les articles
app.get("/blog/articles", (req, res) => {
  const sql = "SELECT * FROM article";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "success", data: rows });
  });
});

//Obtenir un unique article
app.get("/blog/articles/:id", (req, res, next) => {
  const { id: articleID } = req.params;
  const sql = "SELECT * FROM article WHERE id = ?";
  const params = [articleID];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: `Afficher l'article ${articleID}`, data: row });
  });
});

//creation d'un nouveau article
app.post("/blog/article", (req, res) => {
  const { title, abstract, contents, author, creationDate, dateOfLastUpdate } =
    req.body;
  if (
    !title ||
    !abstract ||
    !contents ||
    !author ||
    !creationDate ||
    !dateOfLastUpdate
  ) {
    res.status(400).json({ error: "Merci de remplir tous les champs" });
    return;
  }
  const article = {
    title,
    abstract,
    contents,
    author,
    creationDate,
    dateOfLastUpdate,
  };
  const sql =
    "INSERT INTO article (title, abstract, contents, author, creationDate, dateOfLastUpdate) VALUES (?,?,?,?,?,?)";
  const params = [
    article.title,
    article.abstract,
    article.contents,
    article.author,
    article.creationDate,
    article.dateOfLastUpdate,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res
      .status(201)
      .json({ message: "Article créé avec succès", data: article });
  });
});

//Mettre à jour un article
app.put("/blog/articles/:id", (req, res, next) => {
  const article = [
    req.body.title,
    req.body.abstract,
    req.body.contents,
    req.body.author,
    req.body.creationDate,
    req.body.dateOfLastUpdate,
  ];
  const sql = `UPDATE article SET title = ?, abstract = ?, contents = ?, author = ?, creationDate = ?, dateOfLastUpdate =?`;
  db.run(sql, article, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
  res.json({ message: "success", data: article, changes: this.changes });
});

//Supprimer un article
app.delete("/blog/articles/:id", (req, res, next) => {
  const { id: articleID } = req.params;
  const sql = "DELETE FROM article WHERE id = ?";
  db.run(sql, articleID, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: `article ${articleID} supprimé avec succés`,
      data: this.changes,
    });
  });
});

app.get("/blog", (req, res) => {
  res.json("liste des articles");
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Notre serveur est démaré sur : http://localhost:${port}`)
);
