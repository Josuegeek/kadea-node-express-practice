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

function articleFieldsValidations() {
  return [
    body("title").escape().isLength({ min: 5, max: 255 }).withMessage("Le nom doit avoir entre 5 et 255 caracteres"),
    body("content").escape().isLength({min:5, max:500}).withMessage("le contenu doit avoir entre 5 et 500 caractères"),
    body("description").escape().isLength({min:5, max:500}).withMessage("la description doit avoir entre 5 et 500 caractères"),
    body("urlToImage").isURL().withMessage("Veuillez spécifier le bon url de l'image"),
    body("author").escape().isLength({min:2, max:50}).withMessage("Le nom de l'auteur doit être entre 2 et 50 caractères")
  ]
}

function updateDBJSON(array) {
  fs.writeFileSync("./data/db.json", JSON.stringify(array, null, 2));
}


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/article/update/:slug", (req, res)=>{
  const { slug } = req.params;
  const article = articles.find((article) => article.slug === slug);

  if (article) {
    res.render("updateArticle", { article });
  } else {
    res.render("404");
  }
})

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

app.delete("/articles/:slug", (req, res) => {
  const { slug } = req.params;

  const articleIndex = articles.findIndex((article) => article.slug === slug);
  articles.splice(articleIndex, 1);
  updateDBJSON(articles);
  res.send("ok");
});

app.post("/articles", articleFieldsValidations(), (req, res) => {
  const article = req.body;

  const result = validationResult(req);

  console.log(result.errors);
  if (result.errors.length === 0) {
    article.slug = article.title.toLowerCase().replace(" ", "-");
    article.publishedAt = new Date();

    articles.push(article);
    updateDBJSON(articles);
    res.send("ok");
  } else {
    res.statusCode = 400;
  }
});

/* title,
    author,
    content,
    description,
    image,
    updatedAt
*/
app.put("/articles/:slug", articleFieldsValidations(), (req, res) => {
  const { slug } = req.params;
  const { title, author, content, description, urlToImage } = req.body;

  const articleIndex = articles.findIndex((article) => article.slug === slug);
  if (articleIndex < 0) {
    return res.status(404).send("Not found");
  }

  articles[articleIndex].title = title;
  articles[articleIndex].content = content;
  articles[articleIndex].author = author;
  articles[articleIndex].description = description;
  articles[articleIndex].urlToImage = urlToImage;
  articles[articleIndex].updateAt = new Date();

  updateDBJSON(articles);
});

app.post("/articles/:slug", articleFieldsValidations(), (req, res) => {
  const { slug } = req.params;
  const article = articles.find((a) => a.slug == slug);
  const newArticle = req.body
  newArticle.slug = slug
  const result = validationResult(newArticle);
  console.log(slug,article,newArticle)
  if (result.errors.length === 0) {
    console.log("in")

    if (article) {
      console.log("inner")
      newArticle.slug = article.title.toLowerCase().replace(" ", "-");
      newArticle.publishedAt = new Date();
      const articletoEditIndex = articles.indexOf(article);
      articles[articletoEditIndex] = newArticle
      updateDBJSON(articles);
      res.send("ok");
    } else {
      res.render("404");
    }

    //articles.push(article);
  } else {
    console.log("out")
    res.statusCode = 400;
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
