const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const { body, validationResult } = require("express-validator");

const articles = require("./data/db.json");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(express.json());

function addArticleValidations() {
  return [
    body("title").escape().isLength({ min: 5, max: 255 }).withMessage("Le nom doit avoir entre 5 et 255 caracteres"),
    body("content").escape().isLength({min:5, max:500}).withMessage("le contenu doit avoir entre 5 et 500 caractères"),
    body("description").escape().isLength({min:5, max:500}).withMessage("la description doit avoir entre 5 et 500 caractères"),
    body("urlToImage").isURL().withMessage("Veuillez spécifier le bon url de l'image"),
    body("author").escape().isLength({min:2, max:50}).withMessage("Le nom de l'auteur doit être entre 2 et 50 caractères")
  ]
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/articles", (req, res) => {
  res.render("articles", { articles });
});

// titre :  pas vide, echapper, max : 255 min: 5
// auteur : pas vide, echapper, max: 50 min: 2
// image: pas vide, url
// description: pas vide, echapper, max : 500 min: 5
// contenu : pas vide, echapper, max : 500 min: 5

app.post("/articles", addArticleValidations(), (req, res) => {
  const article = req.body;

  const result = validationResult(req);
  
  article.slug = article.title.toLowerCase().replace(" ", "-");
  article.publishedAt = new Date()
  console.log(result);
  if(result.errors.length<=0){
    articles.push(article);
    fs.writeFileSync("./data/db.json", JSON.stringify(articles,null,2));
    res.render("articles");
  }
  else{
    console.log(result.errors);
    res.render("addArticle", {article, errors : result.errors})
  }
  
});   

app.get("/articles/:slug", (req, res) => {
  const { slug } = req.params;
  const article = articles.find((article) => article.slug === slug);

  if (article) {
    res.render("article", { article });
  } else {
    res.render("404");
  }
});

app.get("/article/add", (req, res) => {
  res.render("addArticle", {article:null, errors:null});
});

app.get("/*", (req, res, next) => {
  res.render("404");
});

const port = 3001;

app.listen(port, function () {
  console.log(`l'application ecoute sur le port ${port}`);
  console.log(`l'application est disponible sur http://localhost:${port}`);
});
